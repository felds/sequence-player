import '../styles/editor.css'
import { map } from '../utils/math'
import { last, head } from 'lodash/fp'

export default class Editor {
    constructor(el, player) {
        this.el = el
        this.player = player
        this.waypoints = []

        this._draw = this._draw.bind(this)

        this.init()
    }
    init() {
        this.player.featuresManager.deinit()
        // this.player.interactionManager.deinit()
        this._setupDOM()
        this._setupActions()
        this._draw()
    }
    deinit() {}

    _setupDOM() {
        this.el.innerHTML = `
        <div class="card">
            <div class="card-block">
                <h4 class="card-title">Waypoint Editor</h4>

                <div class="text-center">
                    <button type="button" class="btn btn-secondary editor__start">⇤</button>
                    <button type="button" class="btn btn-secondary editor__back-10">⇇</button>
                    <button type="button" class="btn btn-secondary editor__back-5">←</button>
                    <button type="button" class="btn btn-secondary editor__fwd-5">→</button>
                    <button type="button" class="btn btn-secondary editor__fwd-10">⇉</button>
                    <button type="button" class="btn btn-secondary editor__end">⇥</button>

                    <button type="button" class="btn btn-outline-danger editor__clear">clear all</button>
                </div>

                <pre><code class="editor__code"></code></pre>
            </div>
        </div>
        `

        this.start = this.el.querySelector('.editor__start')
        this.btnBack10 = this.el.querySelector('.editor__back-10')
        this.btnBack5 = this.el.querySelector('.editor__back-5')
        this.btnFwd5 = this.el.querySelector('.editor__fwd-5')
        this.btnFwd10 = this.el.querySelector('.editor__fwd-10')
        this.btnFwd10 = this.el.querySelector('.editor__fwd-10')
        this.end = this.el.querySelector('.editor__end')
        this.clear = this.el.querySelector('.editor__clear')
        this.code = this.el.querySelector('.editor__code')

        this.overlay = document.createElement('div')
        this.player.el.appendChild(this.overlay)
        this.overlay.classList.add('editor__overlay')

        this.feature = document.createElement('div')
        this.overlay.appendChild(this.feature)
        this.feature.classList.add('editor__feature')
    }

    _setupActions() {
        this.start.onclick = e => this.player.currentFrame = 0
        this.btnBack10.onclick = e =>
            this.player.currentFrame = Math.max(0, this.player.currentFrame - 10)
        this.btnBack5.onclick = e =>
            this.player.currentFrame = Math.max(0, this.player.currentFrame - 5)
        this.btnFwd5.onclick = e =>
            this.player.currentFrame = Math.min(this.player.images.length - 1, this.player.currentFrame + 5)
        this.btnFwd10.onclick = e =>
            this.player.currentFrame = Math.min(this.player.images.length - 1, this.player.currentFrame + 10)
        this.end.onclick = e =>
            this.player.currentFrame = this.player.images.length - 1
        this.clear.onclick = e => {
            this.waypoints = []
            this.code.textContent = "[]"
        }
        

        this.overlay.onmousedown = e => this._mousedown = e
        this.overlay.onmouseup = e => {
            if (this._mousedown.pageX === e.pageX && this._mousedown.pageY === e.pageY)
                this.createWaypoint(e)
        }
    }

    createWaypoint(e) {
        const x = Math.floor(map(e.offsetX, 0, e.target.clientWidth, 0, 1) * 1000) / 1000
        const y = Math.floor(map(e.offsetY, 0, e.target.clientHeight, 0, 1) * 1000) / 1000

        const currFrame = Math.floor(this.player.currentFrame)
        const waypoint = [currFrame, x, y, !e.metaKey];

        this.waypoints = this.waypoints
            .filter(w => w[0] !== currFrame)
            .concat([waypoint])
            .sort((a, b) => a[0] - b[0])

        this.code.textContent =
            "[\n" +
            this.waypoints
                .map(w =>
                    `    [ ${w[0]}, ${w[1].toFixed(5)}, ${w[2].toFixed(5)}, ${w[3]} ],`
                )
                .join("\n")
            + "\n]"
    }

    _draw() {
        const t = this.player.currentFrame

        const w_before  = last(this.waypoints.filter(w => w[0] <= t))
        const w_after   = head(this.waypoints.filter(w => w[0] > t))

        this.feature.style.opacity = (w_before && w_after && w_before[3]) ? 1 : .5

        if (w_before && w_after) {
            const amplitude = map(t, w_before[0], w_after[0], 0, 1)
            this.feature.style.left = map(amplitude, 0, 1, w_before[1], w_after[1]) * 100 + "%"
            this.feature.style.top = map(amplitude, 0, 1, w_before[2], w_after[2]) * 100 + "%"
        }

        this._drawToken = requestAnimationFrame(this._draw)
    }
}
