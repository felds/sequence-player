import strExpand from 'str-expand'
import 'promise-polyfill'
import 'whatwg-fetch'
import './sequence-player.css'
import { map } from './utils/math'
import { quadInOut } from 'eases'

class SequencePlayer {
    constructor (el, range, options) {
        this._el = el
        this._options = Object.assign({}, this.defaultOptions, options)
        this._currentFrame = 0
        this._isAnimating = false
        this._images = []

        this._setupDOM()

        this.range = range


        // animation
        // @TODO extract to animation manager
        this._animate = this._animate.bind(this)
        this._isAnimating = false
        this._animate()
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
        const loaders = images.map(path => new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = _ => resolve(image)
            image.onerror = e => reject(e)
            image.src = path
        }))

        Promise.all(loaders)
            .then(success => {
                this._images = success
                this.goTo(0)

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

    _animate() {
        if (this._isAnimating) {
            const delta = map(Date.now(), this._animateStart, this._animateEnd,
                0, 1)
            const eased = quadInOut(delta)
            const frame = Math.floor(map(eased, 0, 1, this._animateFrom, this._animateTo))
            
            this.goTo(frame)

            if (Date.now() > this._animateEnd) {
                this.goTo(this._animateTo) // snap to last frame
                this._isAnimating = false
            }
        }
        requestAnimationFrame(this._animate)
    }

    goTo(n) {
        // validate if frame exists
        if (this._images[n] === undefined)
            return
            // throw `Invalid frame “${n}”`
        
        this._currentFrame = n
        this._imageContainer.style.backgroundImage = `url(${this._images[n].src})`
    }

    animateTo(n, duration = 1000) {
        this._animateFrom     = this.currentFrame
        this._animateTo       = n
        this._animateStart    = Date.now()
        this._animateEnd      = Date.now() + duration
        this._isAnimating     = true
    }

}

window.SequencePlayer = SequencePlayer


