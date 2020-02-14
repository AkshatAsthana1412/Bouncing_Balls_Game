// setup canvas

const canvas = document.querySelector('canvas');
const scoreCounter = document.querySelector('p')
const ctx = canvas.getContext('2d');
const winStatus = document.querySelector('.game-over')
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// function Shape(x, y, velX, velY, color, size){
//   this.x = x
//   this.y = y
//   this.velX = velX
//   this.velY = velY
//   this.color = color
//   this.size = size
// }

//ES6 code for the above implementation follows:
class Shape{
  constructor(x, y, velX, velY, exists){
    this.x = x
    this.y = y
    this.velX = velX
    this.velY = velY
    this.exists = exists
  }
}

class Ball extends Shape{
  constructor(x, y, velX, velY, exists, color, size){
    super(x, y, velX, velY, exists)
    this.color = color
    this.size = size
  }
}

class EvilCircle extends Shape{
  constructor(x, y, exists, color, size){
    super(x,y,20,20,exists)
    this.color= color
    this.size = size
  }

  draw(){
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = this.color  //this specifies no color inside the circle
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI)
    ctx.stroke()  //This function draws the circle according to specs
  }

  checkBounds(){
    if (this.x + this.size >= width){
      this.x -= this.size
    }
    if (this.x <= this.size){
      this.x += this.size
    }
    if (this.y + this.size >= height){
      this.y -= this.size
    }
    if (this.y <= this.size){
      this.y += this.size
    }
  }

  setControls(){
    let _this = this;
    window.onkeydown = function(e) {
      if (e.key === 'a') {
        _this.x -= _this.velX;
      } else if (e.key === 'd') {
        _this.x += _this.velX;
      } else if (e.key === 'w') {
        _this.y -= _this.velY;
      } else if (e.key === 's') {
        _this.y += _this.velY;
      }
    }
    }

  collisionDetect(){
    for(let i = 0; i < balls.length; i++){
      if(!(this === balls[i])){
        const dx = this.x - balls[i].x
        const dy = this.y - balls[i].y
        const distance = Math.sqrt(dx*dx + dy*dy)

        if (distance >= 0 && distance <= 0.5 * (this.size + balls[i].size)){
          balls[i].exists = false
          // curBalls--
        }
      }
    }
  }
}
//Even though we defined the class Ball in ES6 code,
//the below implementation of it's instance methods is still
//valid, even though it is ES5 code.
Ball.prototype.draw = function(){
  ctx.beginPath()
  ctx.fillStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI)
  ctx.fill()
}

Ball.prototype.update = function(){
  // checking for the right boundary
  if((this.x + this.size) >= width){
    this.velX = -(this.velX)
  }
  // checking for the left boundary
  if((this.x - this.size) <= 0){
    this.velX = -(this.velX)
  }
  // top boundary
  if((this.y + this.size) >= height){
    this.velY = -(this.velY)
  }
  // bottom boundary
  if((this.y - this.size) <= 0){
    this.velY = -(this.velY)
  }

  // automatically updating x and y coordinates for motion
  this.x += this.velX
  this.y += this.velY
}

Ball.prototype.collisionDetect = function(){
  for(let i = 0; i < balls.length; i++){
    if(!(this === balls[i])){
      const dx = this.x - balls[i].x
      const dy = this.y - balls[i].y
      const distance = Math.sqrt(dx*dx + dy*dy)

    if (distance >= 0.9*(this.size + balls[i].size) && distance <= (this.size + balls[i].size)){
      this.color = balls[i].color = `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`
    }
  }
  }
}

const balls = []
while(balls.length < 20){
  let size = random(10,20)
  let ball = new Ball(random(0+size, width-size), random(0+size, height-size),
  random(2,6), random(2,6),true,
  `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,
  size)

  balls.push(ball)
}

let curBalls = balls.length

const evilCircle = new EvilCircle(width/2, height/2, true, 'white', 12)
evilCircle.setControls()
function loop(){
  curBalls = 0
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(0,0,width, height)
  for(let i = 0; i < balls.length; i++){
    evilCircle.draw()
    evilCircle.checkBounds()
    evilCircle.collisionDetect()
    if(balls[i].exists)
    {
      curBalls ++
      balls[i].draw()
      // curBalls ++
      balls[i].update()
      balls[i].collisionDetect()
    }
  }
  if (curBalls === 0){
    winStatus.textContent = 'You Won!!'
  }
  scoreCounter.textContent = `Ball Count: ${curBalls}`
  requestAnimationFrame(loop)
}

loop()
