// @TODO Padded ranges
// @TODO decrement
// @TODO alpha ranges
// @TODO steps



const concat = (x,y) => x.concat(y)
const fmap = (f,xs) => xs.map(f).reduce(concat, [])

Array.prototype.fmap = function(f) {
  return fmap(f,this);
};

const arrayRange = (from, to) => new Array(to - from + 1)
    .fill(0)
    .map((_, i) => parseInt(from) + i)

export default function expandUrlRange(pattern) {
    // detect braces
    // https://regex101.com/r/NUZ0mY/2
    const bracesRegex = /\{([^\}]*?)\}/
    const bracesMatch = bracesRegex.exec(pattern)
    if (bracesMatch) {
        const vals = bracesMatch[1].split(',')
        return vals
            .map(v => pattern.replace(bracesRegex, v))
            .fmap(s => expandUrlRange(s))
    }

    // https://regex101.com/r/NUZ0mY/3
    const bracketsRegex = /\[(\d+)\.\.(\d+)\]/
    const bracketsMatch = bracketsRegex.exec(pattern)
    if (bracketsMatch) {
        const { 1: from, 2: to } = bracketsMatch
        return arrayRange(from, to)
            .map(v => pattern.replace(bracketsRegex, v))
            .fmap(s => expandUrlRange(s))
    }
    

    return [ pattern ]
}