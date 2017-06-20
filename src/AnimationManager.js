import { quadInOut } from 'eases'
import { map } from './utils/math'

export default class AnimationManager {
    constructor(player) {
        this.player = player
        this.isAnimating = false

        this.init()
    }

    init() {
        this._animate = this._animate.bind(this)
        this._animate()
    }

    deinit() {
        if (this._animationToken !== undefined)
            cancelAnimationFrame(this._animationToken)
    }

    _animate() {
        if (this.isAnimating) {
            const delta = map(Date.now(), this._animateStart, this._animateEnd,
                0, 1)
            const eased = quadInOut(delta)
            const frame = Math.floor(map(eased, 0, 1, this._animateFrom, this._animateTo))
            
            this.player.currentFrame = frame

            if (Date.now() > this._animateEnd) {
                this.player.currentFrame = this._animateTo // snap to last frame
                this.isAnimating = false
            }
        }

        this._animationToken = requestAnimationFrame(this._animate)
    }

    animateTo(n, duration = 1000) {
        this._animateFrom     = this.player.currentFrame
        this._animateTo       = n
        this._animateStart    = Date.now()
        this._animateEnd      = Date.now() + duration
        
        this.isAnimating     = true
    }

}
