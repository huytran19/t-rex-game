import { Vector } from "@/Type";

export class Background {
    private backgroundImage: HTMLImageElement = new Image()

    constructor(
        private backgroundWidth: number,
        private backgroundHeight: number,
        private position: Vector,
        image: string
    ) {
        this.backgroundWidth = backgroundWidth
        this.backgroundHeight = backgroundHeight
        this.position = position
        this.backgroundImage.src = image
    }

    get width(): number {
        return this.backgroundWidth
    }

    get height(): number {
        return this.backgroundHeight
    }

    get pos(): Vector {
        return this.position
    }

    get image(): HTMLImageElement {
        return this.backgroundImage
    }

    run(gameSpeed: number): void {
        this.position.x -= gameSpeed
        if (this.position.x < -(this.backgroundWidth/2)) {
            this.position.x = 0
        }
    }
}