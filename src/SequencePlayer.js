import Promise from 'promise-polyfill'
import strExpand from 'str-expand'
import AnimationManager from './AnimationManager'
import InteractionManager from './InteractionManager'
import FeaturesManager from './FeaturesManager'
import './styles/sequence-player.css'

const createImageLoaderPromise = path =>
    new Promise((resolve, reject) => {
        const image = new Image()

        image.onload    = e => resolve(image)
        image.onerror   = e => reject(e)
        image.src       = path
    })


export default class SequencePlayer {
    constructor(el, srcPattern, options) {
        this.el = el
        this.srcPattern = srcPattern
        
        this.options = { ...this.defaultOptions, ...options }
        this.images = []


        this.animationManager = new AnimationManager(this)


        this.interactionManager = new InteractionManager(this, this.options.loopingFrame)
        this.interactionManager.onstartdrag = _ => {
            this.el.classList.add('sequence-player--dragging')
        }
        this.interactionManager.onstopdrag = _ => {
            this.el.classList.remove('sequence-player--dragging')
        }


        this.featuresManager = new FeaturesManager(this, this.options.features)


        this._draw = this._draw.bind(this)
        this.init()
    }


    init() {
        this._setupDOM()
        this._draw()
    }
    deinit() {

    }


    get defaultOptions() {
        return {
            aspectRatio: 1,
            imagesLoadedCallback: undefined,
            imagesFailedLoadingCallback: undefined,
            loopingFrame: 0,
            features: [],
        }
    }


    get currentFrame() {
        return this._currentFrame || 0
    }
    set currentFrame(n) {
        if (n < this.images.length)
            this._currentFrame = n
    }


    get isAnimating() {
        return this.animationManager.isAnimating
    }

    
    set srcPattern(srcPattern) {
        this._range = srcPattern

        this._loadImages(strExpand(srcPattern))
    }


    _draw() {
        const w     = this.el.offsetWidth * (window.devicePixelRatio || 1)
        const h     = this.el.offsetHeight * (window.devicePixelRatio || 1)
        const ctx   = this._imageContainer.getContext('2d')

        this._imageContainer.width  = w
        this._imageContainer.height = h

        const frame = Math.floor(this.currentFrame)
        const image = this.images[frame]

        if (image) {
            ctx.drawImage(image, 0, 0, w, h)
        }

        requestAnimationFrame(this._draw)
    }


    _setupDOM() {
        this.el.classList.add('sequence-player')
        this.el.style.paddingTop = (1 / this.options.aspectRatio) * 100 + '%'

        this._imageContainer = document.createElement('canvas')
        this._imageContainer.classList.add('sequence-player__image')
        this.el.appendChild(this._imageContainer)
    }


    _loadImages(images) {
        Promise.all(images.map(createImageLoaderPromise))
            .then(success => {
                this.images = success
                this.currentFrame = 0

                if (typeof this.options.imagesLoadedCallback === 'function') {
                    this.options.imagesLoadedCallback(this)
                }
            })
            .catch(fail => {
                if (typeof this.options.imagesFailedLoadingCallback === 'function') {
                    this.options.imagesFailedLoadingCallback(this)
                }
            })
    }

    animateTo(n, duration, easing) {
        this.animationManager.animateTo(n, duration, easing)
    }

}
