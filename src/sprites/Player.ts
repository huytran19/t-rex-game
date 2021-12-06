import { Vector } from "@/Type";
import { CanvasView } from '../view/CanvasView'

import RUN_1 from '../images/trex_run_1.png'
import RUN_2 from '../images/trex_run_2.png'
import DUCK_1 from '../images/trex_duck_1.png'
import DUCK_2 from '../images/trex_duck_2.png'

export class Player {
    private playerImage: HTMLImageElement = new Image()
    private imageDuck1: string
    private imageDuck2: string
    private image_tRex: string
    private isDuck1: boolean
    private isRun1: boolean
    private isJump: boolean
    private duck: boolean
    private dy: number
    private jumpForce: number
    private runWidth: number
    private runHeight: number
    private runPosY: number
    private grounded: boolean
    private jumpTimer: number
    private gravityNumber: number
    private runTime: number
    private duckTime: number
    private deltaTime: number

    constructor(
        private playerWidth: number,
        private playerHeight: number,
        private position: Vector,
        image: string
    ) {
        this.playerWidth = playerWidth
        this.playerHeight = playerHeight
        this.position = position
        this.runPosY = position.y
        this.playerImage.src = image
        this.image_tRex = image
        this.imageDuck1 = DUCK_1
        this.imageDuck2 = DUCK_2
        this.isRun1 = false
        this.isDuck1 = false
        this.dy = 0
        this.jumpForce = 10
        this.runHeight = playerHeight
        this.runWidth = playerWidth
        this.grounded = false
        this.isJump = false
        this.duck = false
        this.jumpTimer = 0;
        this.gravityNumber = 0.7
        this.duckTime = 0
        this.runTime = 0
        this.deltaTime = 0.0625

        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    }

    get width(): number {
        return this.playerWidth
    }

    get height(): number {
        return this.playerHeight
    }

    get pos(): Vector {
        return this.position
    }

    get image(): HTMLImageElement {
        return this.playerImage
    }

    get isGrounded(): boolean {
        return this.grounded
    }

    get jumping(): boolean {
        return this.isJump
    }

    handleKeyDown = (e: KeyboardEvent): void => {
        if (e.code === 'ArrowUp' || e.key === 'ArrowUp' || e.code === 'Space') this.isJump = true
        if (e.code === 'ArrowDown' || e.key === 'ArrowDown') this.duck = true
    }
    handleKeyUp = (e: KeyboardEvent): void => {
        if (e.code === 'ArrowUp' || e.key === 'ArrowUp' || e.code === 'Space') this.isJump = false
        if (e.code === 'ArrowDown' || e.key === 'ArrowDown') this.duck = false
    }

    playerStart(): void {
        this.playerImage.src = RUN_1
        this.isRun1 = true
    }
    
    switchDuck(type: string): void {
        if (type == "run") {
            if (this.isRun1) {
                this.playerImage.src = RUN_1
                this.isRun1 = false
                return
            }
            if (!this.isRun1) {
                this.playerImage.src = RUN_2
                this.isRun1 = true
                return
            }
        } else if (type == "duck") {
            this.playerWidth = this.runWidth * 1.35
            this.playerHeight = this.runHeight * 0.6
            this.position.y = this.runPosY + (this.runHeight * (1-0.6))

            if (this.isDuck1) {
                this.playerImage.src = DUCK_1
                this.isDuck1 = false
                return
            }
            if (!this.isDuck1) {
                this.playerImage.src = DUCK_2
                this.isDuck1 = true
                return
            }
        }
    }
    gravity(view: CanvasView): void {
        this.runTime += this.deltaTime
        this.duckTime += this.deltaTime
        if (this.isJump) {
            this.jump()
        } else {
            this.jumpTimer = 0
        }
        if (this.duck) {
            if (this.duckTime > 0.5 && this.grounded == true){
                this.duckTime = 0
                this.switchDuck("duck")
            }
        } else {
            this.playerWidth = this.runWidth
            this.playerHeight = this.runHeight
        }

        this.position.y += this.dy 

        if (this.position.y + this.playerHeight < view.canvas.height - 20) {
            this.dy += this.gravityNumber
            this.grounded = false
            this.playerImage.src = this.image_tRex
        } else {
            this.dy = 0
            this.grounded = true
            this.position.y = view.canvas.height - this.playerHeight - 20
        }

        if (this.runTime > 0.5 && this.grounded == true && this.duck == false){
            this.runTime = 0
            this.switchDuck("run")
        }
    }

    jump(): void {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 2
            this.dy -= this.jumpForce
        } 
        else if (this.jumpTimer > 0 && this.jumpTimer < 7) {
            this.jumpTimer++
            this.dy = -this.jumpForce - (this.jumpTimer/50)
        }
    }


}