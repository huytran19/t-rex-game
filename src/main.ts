import { CanvasView } from "./view/CanvasView";
import { Player, Obstacle, Background} from "@/sprites";

import BACKGROUND_IMAGE from './images/ground.png'
import TREX_IMAGE from './images/trex.png'
import LARGE_CACTUS_IMAGE from './images/cactus_large.png'
import SMALL_CACTUS_IMAGE from './images/cactus_small.png'
import BIRD_IMAGE from './images/bird_down.png'

import { PlayerWidth,
    PlayerHeight,
    PlayerStartX,
    PlayerStartY,
    BackgroundWidth,
    BackgroundHeight,
    BackgroundStartX,
    BackgroundStartY,
    CactusLargeWidth,
    CactusLargeHeight,
    CactusLargeStartX,
    CactusLargeStartY,
    CactusSmallWidth,
    CactusSmallHeight,
    CactusSmallStartX,
    CactusSmallStartY,
    BirdWidth,
    BirdHeight,
    BirdStartX,
    BirdStartY } from './setup'

let gameOver = false
let score = 0
let highScore: number
let gameSpeed = 3
let initialSpawnTimer = 100
let obstacles: Obstacle[] = []

function setGameOver(view: CanvasView) {
    gameOver = false
    document.querySelector("#start")?.setAttribute("style", "display: block")
}

function SpawnObstacle(view: CanvasView, gameSpeed: number) {
    let obstacleImage
    let pos 
    let obsWidth
    let obsHeight
    let typeOfObstacle = RandomIntInRange(0, 1)
    let obstacle
        if (typeOfObstacle == 0) {
            let typeOfCactus = RandomIntInRange(0, 1)
            
            if (typeOfCactus == 0) {
                obstacleImage = LARGE_CACTUS_IMAGE
                obsWidth = CactusLargeWidth
                obsHeight = CactusLargeHeight
                pos = view.canvas.height - obsHeight - 20
            } else {
                obstacleImage  = SMALL_CACTUS_IMAGE
                obsWidth = CactusSmallWidth
                obsHeight = CactusSmallHeight
                pos = view.canvas.height - obsHeight - 20
            }
            obstacle = new Obstacle (obsWidth, obsHeight, {x: CactusLargeStartX, y: pos}, obstacleImage, gameSpeed)
        } else {
            obstacleImage = BIRD_IMAGE
            pos = BirdStartY
            obstacle = new Obstacle (35, 15, {x: BirdStartX, y: pos}, obstacleImage, gameSpeed)
        }
    obstacles.push(obstacle)
}

function RandomIntInRange(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min)
}

let spawnTimer = initialSpawnTimer;
function gameLoop(
    view: CanvasView,
    player: Player,
    obstacles: Obstacle[],
    background: Background
) {
    view.clear()
    view.drawSprite(player)
    view.drawSprite(background)
    view.drawObstacles(obstacles)
    background.Run(gameSpeed)
    player.Gravity(view)
    spawnTimer--
    if (spawnTimer <= 0) {
        gameSpeed += 0.003
        SpawnObstacle(view, gameSpeed)
        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i]
        if (o.pos.y == BirdStartY) o.Run("bird")
        if (o.pos.x + o.width < -100) {
            obstacles.splice(i, 1);
        }

        if (
            player.pos.x < o.pos.x + o.width &&
            player.pos.x + player.width > o.pos.x &&
            player.pos.y < o.pos.y + o.height &&
            player.pos.y + player.height > o.pos.y
        ) {
            obstacles = []
            if (score > highScore) {
                highScore = score
                view.drawInfo(highScore)
            } else view.drawInfo(highScore)
            score = 0
            spawnTimer = initialSpawnTimer
            gameSpeed = 3
            return setGameOver(view)
            
        }
        o.Run("cactus")
    }

    score++
    view.drawScore(score)
    
    requestAnimationFrame(() => gameLoop(view, player, obstacles, background))
}

function startGame(view: CanvasView) {
    document.querySelector("#start")?.setAttribute("style", "display: none;")
    score = 0
    obstacles = []
    gameSpeed = 5
    view.drawScore(0)
    const background = new Background(BackgroundWidth, BackgroundHeight, {x: BackgroundStartX, y: BackgroundStartY}, BACKGROUND_IMAGE)
    const player = new Player(PlayerWidth, PlayerHeight, {x: PlayerStartX, y: PlayerStartY}, TREX_IMAGE)
    const obstacle = new Obstacle(CactusLargeWidth, CactusLargeHeight, {x: CactusLargeStartX, y: CactusLargeStartY}, LARGE_CACTUS_IMAGE, gameSpeed)
    obstacles.push(obstacle)
    player.playerStart()
    gameLoop(view, player, obstacles, background)
}
highScore = score
const view = new CanvasView('#playField')
view.initStartButton(startGame)