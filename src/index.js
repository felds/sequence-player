import strExpand from 'str-expand'

class SequencePlayer {
    constructor (el, range) {
        this._images = strExpand(range)

        console.log(this._images)
    }
}

window.SequencePlayer = SequencePlayer