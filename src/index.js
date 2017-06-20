import strExpand from 'str-expand'
import 'promise-polyfill'
import 'whatwg-fetch'
import './sequence-player.css'


class SequencePlayer {
    constructor (el, range, options) {
        this._el = el
        this._options = Object.assign({}, this.defaultOptions, options)

        this.range = range

        this._setupDOM()
    }

    get defaultOptions() {
        return {
            aspectRatio: 1,
            imagesLoadedCallback: undefined,
            imagesFailedLoadingCallback: undefined,
        }
    }

    set range(range) {
        this._range = range

        this._loadImages(strExpand(range))
    }

    _setupDOM() {
        this._el.classList.add('sequence-player')
        this._el.style.paddingTop = (1 / this._options.aspectRatio) * 100 + '%'

        this._imageContainer = document.createElement('div')
        this._imageContainer.classList.add('sequence-player__image')
        this._el.appendChild(this._imageContainer)
    }

    _loadImages(images) {
        Promise.all(images.map(f => fetch(f)))
            .then(success => {
                console.log('finished loading', typeof this._options.imagesLoadedCallback)
                if (typeof this._options.imagesLoadedCallback === 'function') {
                    this._options.imagesLoadedCallback(this)
                }
            })
            .catch(fail => {
                if (typeof this._options.imagesFailedLoadingCallback === 'function') {
                    this._options.imagesFailedLoadingCallback(this)
                }
            })
    }

}

window.SequencePlayer = SequencePlayer


