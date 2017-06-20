import { normalize } from './utils/math'

export default class InteractionManager {
    constructor (player, loopingFrame = 0) {
        this.player         = player
        this.loopingFrame   = loopingFrame

        this.init()
    }

    init() {
        this._handleMouseDown   = this._handleMouseDown.bind(this)
        this._handleMouseMove   = this._handleMouseMove.bind(this)
        this._handleMouseUp     = this._handleMouseUp.bind(this)
        this._handleTouchStart  = this._handleTouchStart.bind(this)
        this._handleTouchMove   = this._handleTouchMove.bind(this)
        this._handleTouchEnd    = this._handleTouchEnd.bind(this)

        this.player.el.addEventListener('mousedown', this._handleMouseDown)
        window.addEventListener('mousemove', this._handleMouseMove)
        window.addEventListener('mouseup', this._handleMouseUp)
        this.player.el.addEventListener('touchstart', this._handleTouchStart)
        this.player.el.addEventListener('touchmove', this._handleTouchMove)
        this.player.el.addEventListener('touchend', this._handleTouchEnd)
        this.player.el.addEventListener('touchcancel', this._handleTouchEnd)
    }

    deinit() {
        this.player.el.removeEventListener('mousedown', this._handleMouseDown)
        window.removeEventListener('mousemove', this._handleMouseMove)
        window.removeEventListener('mouseup', this._handleMouseUp)
        this.player.el.removeEventListener('touchstart', this._handleTouchStart)
        this.player.el.removeEventListener('touchmove', this._handleTouchMove)
        this.player.el.removeEventListener('touchend', this._handleTouchEnd)
        this.player.el.removeEventListener('touchcancel', this._handleTouchEnd)
    }

    get sensitivity() {
        // @XXX but why?!
        return 200 / this.player.el.offsetWidth
    }

    _startDrag(pos) {
        this.isDragging = true

        this._startPos = pos
        this._startFrame = this.player.currentFrame
    }

    _drag(pos) {
        // @TODO check if its animating
        if (!this.isDragging) return
        
        const playerFrames = this.player.length
        const targetFrame = this._startFrame - Math.floor((pos - this._startPos) * this.sensitivity)
        
        this.player.currentFrame = normalize(playerFrames - this.loopingFrame, targetFrame - this.loopingFrame) + this.loopingFrame
    }
    
    _stopDrag() {
        this.isDragging = false
    }

    _handleMouseDown(e) {
        this._startDrag(e.pageX)
    }

    _handleMouseMove(e) {
        this._drag(e.pageX)
    }

    _handleMouseUp(e) {
        this._stopDrag()
    }

    _handleTouchStart(e) {
        this._startDrag(e.touches[0].pageX)
    }

    _handleTouchMove(e) {
        this._drag(e.touches[0].pageX)
    }

    _handleTouchEnd(e) {
        this._stopDrag()
    }
}