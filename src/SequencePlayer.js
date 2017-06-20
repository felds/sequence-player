import strExpand from 'str-expand'
import 'promise-polyfill'
import 'whatwg-fetch'
import './styles/sequence-player.css'
import AnimationManager from './AnimationManager'

export default class SequencePlayer {
    constructor (el, srcPattern, options) {
        this._el = el
        this._options = Object.assign({}, this.defaultOptions, options)
        this._currentFrame = 0
        this._isAnimating = false
        this._images = []

        this._setupDOM()

        this.srcPattern = srcPattern
        
        this.animationManager = new AnimationManager(this)
    }

    get defaultOptions() {
        return {
            aspectRatio: 1,
            imagesLoadedCallback: undefined,
            imagesFailedLoadingCallback: undefined,
        }
    }

    get currentFrame() {
        return this._currentFrame
    }

    set currentFrame(n) {
        // validate if frame exists
        if (this._images[n] === undefined)
            return
            // throw `Invalid frame “${n}”`
        
        this._currentFrame = n
        this._imageContainer.style.backgroundImage = `url(${this._images[n].src})`
    }

    set srcPattern(srcPattern) {
        this._range = srcPattern

        this._loadImages(strExpand(srcPattern))
    }

    _setupDOM() {
        this._el.classList.add('sequence-player')
        this._el.style.paddingTop = (1 / this._options.aspectRatio) * 100 + '%'

        this._imageContainer = document.createElement('div')
        this._imageContainer.classList.add('sequence-player__image')
        this._el.appendChild(this._imageContainer)
    }

    _loadImages(images) {
        const loaders = images.map(path => new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = _ => resolve(image)
            image.onerror = e => reject(e)
            image.src = path
        }))

        Promise.all(loaders)
            .then(success => {
                this._images = success
                this.currentFrame = 0

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

    animateTo(n, duration = 1000) {
        this.animationManager.animateTo(n, duration)
    }
}
