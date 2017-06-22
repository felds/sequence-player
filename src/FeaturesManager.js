const withAnchors = player => f => {
    const anchor = document.createElement('a')
    anchor.title = f.title
    anchor.href = `#${f.targetPosition}`
    anchor.classList.add('sequence-player__anchor')
    anchor.addEventListener('click',e => {
        e.stopPropagation()
        player.animateTo(f.targetPosition)
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
            .map(withAnchors(this.player))
            .map(timesToFrames(30))

        console.log(this._features)
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
        this._drawToken = requestAnimationFrame(this._draw)
    }
}
