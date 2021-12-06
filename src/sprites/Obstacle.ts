import { Vector } from "@/Type";
import { CanvasView } from "@/view/CanvasView";

import FLY_DOWN_IMAGE from '../images/bird_down.png'
import FLY_UP_IMAGE from '../images/bird_up.png'

export class Obstacle {
    private obstacleImage: HTMLImageElement = new Image()
    private obstacleSpeed: number
    private flyTime: number
    private deltaTime: number
    private isFlyDown: boolean

    constructor(
        private obstacleWidth: number,
        private obstacleHeight: number,
        private position: Vector,
        image: string,
        speed: number
    ) {
        this.obstacleWidth = obstacleWidth
        this.obstacleHeight = obstacleHeight
        this.position = position
        this.obstacleImage.src = image
        this.obstacleSpeed = speed
        this.flyTime = 0
        this.deltaTime = 0.0625
        this.isFlyDown = false
    }

    get width(): number {
        return this.obstacleWidth
    }

    get height(): number {
        return this.obstacleHeight
    }

    get pos(): Vector {
        return this.position
    }

    get image(): HTMLImageElement {
        return this.obstacleImage
    }

    run(type: string): void {
        this.flyTime += this.deltaTime
        if (type == "cactus") this.position.x -= this.obstacleSpeed
        
        if (type == "bird") {
            if (this.flyTime > 1) {
                this.flyTime = 0
                this.fly()
            }
            
        }
    }

    fly(): void {
        if (this.isFlyDown) {
            this.obstacleImage.src = FLY_UP_IMAGE
            this.isFlyDown = false
            return
        }
        if (!this.isFlyDown) {
            this.obstacleImage.src = FLY_DOWN_IMAGE
            this.isFlyDown = true
            return
        }
    }
}