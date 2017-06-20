import strExpand from 'str-expand'
import './sequence-player.css'

class SequencePlayer {
    constructor (el, range, options) {
        this._images = strExpand(range)
        this._el = el
        this._options = Object.assign({}, this.defaultOptions, options)

        this._setupDOM()
    }

    get defaultOptions() {
        return {
            aspectRatio: 1,
        }
    }

    _setupDOM() {
        this._el.classList.add('sequence-player')
        this._el.style.paddingTop = (1 / this._options.aspectRatio) * 100 + '%'

        this._imageContainer = document.createElement('div')
        this._imageContainer.classList.add('sequence-player__image')
        this._el.appendChild(this._imageContainer)
    }
}

window.SequencePlayer = SequencePlayer


