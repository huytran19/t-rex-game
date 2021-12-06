import { CanvasView } from "./view/CanvasView";
import { Player, Obstacle, Background} from "@/sprites";

import BACKGROUND_IMAGE from './images/ground.png'
import TREX_IMAGE from './images/trex.png'
import LARGE_CACTUS_IMAGE from './images/cactus_large.png'
import SMALL_CACTUS_IMAGE from './images/cactus_small.png'
import BIRD_IMAGE from './images/bird_down.png'

import { 
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_START_X,
    PLAYER_START_Y,
    BACKGROUND_WIDTH,
    BACKGROUND_HEIGHT,
    BACKGROUND_START_X,
    BACKGROUND_START_Y,
    CACTUS_LARGE_WIDTH,
    CACTUS_LARGE_HEIGHT,
    CACTUS_LARGE_START_X,
    CACTUS_LARGE_START_Y,
    CACTUS_SMALL_WIDTH,
    CACTUS_SMALL_HEIGHT,
    CACTUS_SMALL_START_X,
    CACTUS_SMALL_START_Y,
    BIRD_WIDTH,
    BIRD_HEIGHT,
    BIRD_START_X,
    BIRD_START_Y
} from './Setting'

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

function spawnObstacle(view: CanvasView, gameSpeed: number) {
    let obstacleImage
    let newPositionY 
    let obsWidth
    let obsHeight
    let typeOfObstacle = randomIntInRange(0, 1)
    let obstacle
        if (typeOfObstacle == 0) {
            let typeOfCactus = randomIntInRange(0, 1)
            
            if (typeOfCactus == 0) {
                obstacleImage = LARGE_CACTUS_IMAGE
                obsWidth = CACTUS_LARGE_WIDTH
                obsHeight = CACTUS_LARGE_HEIGHT
                newPositionY = view.canvas.height - obsHeight - 20
            } else {
                obstacleImage  = SMALL_CACTUS_IMAGE
                obsWidth = CACTUS_SMALL_WIDTH
                obsHeight = CACTUS_SMALL_HEIGHT
                newPositionY = view.canvas.height - obsHeight - 20
            }
            obstacle = new Obstacle(obsWidth, obsHeight, {x: CACTUS_LARGE_START_X, y: newPositionY}, obstacleImage, gameSpeed)
        } else {
            obstacleImage = BIRD_IMAGE
            newPositionY = BIRD_START_Y
            obstacle = new Obstacle(35, 15, {x: BIRD_START_X, y: newPositionY}, obstacleImage, gameSpeed)
        }
    obstacles.push(obstacle)
}

function randomIntInRange(min: number, max: number): number {
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
    background.run(gameSpeed)
    player.gravity(view)
    spawnTimer--
    if (spawnTimer <= 0) {
        gameSpeed += 0.01
        spawnObstacle(view, gameSpeed)
        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i]
        if (o.pos.y == BIRD_START_Y) o.run("bird")
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
        o.run("cactus")
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
    const background = new Background(BACKGROUND_WIDTH, BACKGROUND_HEIGHT, {x: BACKGROUND_START_X, y: BACKGROUND_START_Y}, BACKGROUND_IMAGE)
    const player = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, {x: PLAYER_START_X, y: PLAYER_START_Y}, TREX_IMAGE)
    const obstacle = new Obstacle(CACTUS_LARGE_WIDTH, CACTUS_LARGE_HEIGHT, {x: CACTUS_LARGE_START_X, y: CACTUS_LARGE_START_Y}, LARGE_CACTUS_IMAGE, gameSpeed)
    obstacles.push(obstacle)
    player.playerStart()
    gameLoop(view, player, obstacles, background)
}
highScore = score
const view = new CanvasView('#playField')
view.initStartButton(startGame)