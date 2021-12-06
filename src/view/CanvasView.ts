import { Vector } from "@/Type";
import { Player, Obstacle, Background } from "@/sprites";
export class CanvasView {
    canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private scoreDisplay: HTMLObjectElement | null
    private start: HTMLObjectElement | null
    private info: HTMLObjectElement | null

    constructor(canvasName: string) {
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement
        this.context = this.canvas.getContext('2d')
        this.scoreDisplay = document.querySelector('#score')
        this.start = document.querySelector('#start')
        this.info = document.querySelector('#info')
    }

    clear(): void {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    initStartButton(startFunction: (view: CanvasView) => void): void {
        this.start?.addEventListener('click', () => startFunction(this))
    }

    drawScore(score: number): void {
        if (this.scoreDisplay) this.scoreDisplay.innerHTML = "Score: " + score.toString()
    }

    drawInfo(highScore: number): void {
        if (this.info) this.info.innerHTML = "High score: " + highScore.toString()
    }

    drawSprite(entity: Player | Obstacle | Background): void {
        if (!entity) return
        this.context?.drawImage(
            entity.image,
            entity.pos.x,
            entity.pos.y,
            entity.width,
            entity.height,
        )
    }

    drawBackground(entity: Background): void {
        if (!entity) return
        
        this.context?.drawImage(
            entity.image,
            entity.pos.x + entity.width,
            entity.pos.y,
            entity.width,
            entity.height,
        )
    }

    drawObstacles(obstacles: Obstacle[]): void {
        obstacles.forEach(obstacle => this.drawSprite(obstacle))
    }
}