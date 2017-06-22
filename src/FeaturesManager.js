import { last, head } from 'lodash/fp'
import { map } from './utils/math'


const withAnchors = player => f => {
    const anchor = document.createElement('a')
    anchor.title = f.title
    anchor.href = `#${f.targetPosition}`
    anchor.classList.add('sequence-player__anchor')
    anchor.addEventListener('click', e => {
        e.preventDefault()
        player.animateTo(f.targetPosition)
    })
    anchor.addEventListener('mousedown', e => {
        e.preventDefault()
    })

    return { ...f, anchor }
}


const timeToFrame = fps => t => Math.floor(fps * t)
const timesToFrames = fps => f => {
    const converter = timeToFrame(fps)
    const waypoints = f.waypoints.map(w => [ converter(w[0]), ...w.slice(1) ])
    const targetPosition = converter(f.targetPosition)

    return { ...f, waypoints, targetPosition }
}


export default class FeaturesManager {
    constructor(player, features) {
        this.player     = player
        this.features   = features

        this._draw = this._draw.bind(this)

        this.init()
    }
    init() {
        this._setupDOM()
        this._draw()
    }
    deinit() {
        if (this._drawToken) cancelAnimationFrame(this._drawToken)
    }


    set features(fs) {
        this._features = fs
            .map(timesToFrames(30))
            .map(withAnchors(this.player))
    }
    get features() {
        return this._features
    }

    _setupDOM()
    {
        // add overlay
        this.overlay = document.createElement('div')
        this.overlay.classList.add('sequence-player__features')
        this.player.el.appendChild(this.overlay)

        // add anchors
        this.features.forEach(f => this.overlay.appendChild(f.anchor))
    }

    _draw() {
        const t = this.player.currentFrame

        this.features.forEach(f => {
            const w_before  = last(f.waypoints.filter(w => w[0] <= t))
            const w_after   = head(f.waypoints.filter(w => w[0] > t))

            f.anchor.style.opacity = (w_before && w_after && w_before[3]) ? 1 : 0

            if (w_before && w_after) {
                const amplitude = map(t, w_before[0], w_after[0], 0, 1)
                f.anchor.style.position = 'absolute'
                f.anchor.style.left = map(amplitude, 0, 1, w_before[1], w_after[1]) * 100 + "%"
                f.anchor.style.top = map(amplitude, 0, 1, w_before[2], w_after[2]) * 100 + "%"
            }
        })

        this._drawToken = requestAnimationFrame(this._draw)
    }
}
