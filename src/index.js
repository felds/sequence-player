import expandUrlRange from './utils/expand-url-range.js'

class SequencePlayer {
    constructor (el, range) {
        this._images = expandUrlRange(range)

        console.log(this._images)
    }
}

window.SequencePlayer = SequencePlayer