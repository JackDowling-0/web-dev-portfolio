const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//create a context object the size of hte browser
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//style the context object
c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

const SPEED = .25
const ROTATION_SPEED = 0.05
const PROJECTILE_SPEED = 3.5
var bullets = []

//@class definitions

//@Bullet
class Bullet {
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x + 30, this.position.y, 5, 0, Math.PI * 2, false);
        c.closePath();
        c.strokeStyle = 'red'
        c.stroke()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

//@player
class Player {
    constructor({ position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.rotation = 0
    }
    
    draw() {
        //draw the ship (triangle)
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        c.beginPath()
        c.moveTo(this.position.x + 30, this.position.y)
        c.lineTo(this.position.x + 30, this.position.y)
        c.lineTo(this.position.x - 10, this.position.y - 10)
        c.lineTo(this.position.x - 10, this.position.y + 10)
        c.closePath();

        c.strokeStyle= 'white'
        c.stroke();
        
        //draw the flame trail
        c.beginPath()
        c.moveTo(this.position.x - 12, this.position.y - 9)
        //this grossness is the only way to ensure the flame trail grows no matter the sign of Vx and Vy
        c.lineTo(this.position.x - 30 - Math.abs(Math.abs(this.velocity.x) + Math.abs(this.velocity.y)), this.position.y)
        c.lineTo(this.position.x - 12, this.position.y + 9)
        c.closePath()
        c.strokeStyle = 'red'
        c.stroke()
        c.restore()
    }

    update() {
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

//initialize the player on the screen
const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
})
player.draw();



const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


//@bullet
function spawnBullet(){
    bullets.push(new Bullet(
        {x: player.position.x + Math.cos(player.rotation) * 30 - 30, y: player.position.y + Math.sin(player.rotation) * 30},
        {x: Math.cos(player.rotation) * PROJECTILE_SPEED, y:  Math.sin(player.rotation) * PROJECTILE_SPEED}
    )) 
    if (bullets.length > 10) {
        const projectile = bullets[0]
        projectile.delete()
    }
}


//@update key animation cycle
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //move the player

    //player velocity

    if (keys.w.pressed) {
        player.velocity.x += Math.cos(player.rotation) * SPEED
        player.velocity.y += Math.sin(player.rotation) * SPEED
    } else {
        player.velocity.x *= .99
        player.velocity.y *= .99
    }

    if (keys.s.pressed) player.velocity.x = -1

    //player rotation
    if (keys.d.pressed) player.rotation += ROTATION_SPEED
    if (keys.a.pressed) player.rotation -= ROTATION_SPEED
    
    //@TO DO add  other keys
    

    //update player position and redraw
    console.log(bullets)
    player.update();
    //update bullets
    for (let i = 0; i < bullets.length; i++) {
        const proj = bullets[i]
        proj.update()
        //delete bullets
        if (proj.position.x < 0 || proj.position.x > canvas.width || proj.position.y < 0  || proj.position.y > canvas.height){
            bullets.splice(i, 1)
        }
    }

}

animate();


//@event listeners
onkeydown = (event) => {
    // console.log(event.key)
    if (event.key === 'w') {
        keys.w.pressed = true
    } 
    
    if (event.key === 's') {
        keys.s.pressed = true
    } 
    
    if (event.key === 'a') {
        keys.a.pressed = true
    } 
    
    if (event.key === 'd') {
        keys.d.pressed = true
    }

    if (event.key === ' ') {
        spawnBullet()
    }
    if (event.key === 't') {
        console.log(bullets)
    }
    if (event.key === 'g') {
        player.velocity = {x: 0, y: 0}
    }
    if (event.key === 'r') {
        player.position = {x: canvas.width / 2, y: canvas.height / 2}
        player.velocity = {x: 0, y: 0}
        bullets = []
    }
}

onkeyup = (event) => {
    if (event.key === 'w') {
        keys.w.pressed = false
    } 
    
    if (event.key === 's') {
        keys.s.pressed = false
    } 
    
    if (event.key === 'a') {
        keys.a.pressed = false
    } 
    
    if (event.key === 'd') {
        keys.d.pressed = false
    }
}