//環境變數
var updateFPS = 30
var showMouse = true
var time = 0
var bgColor ="black"

//控制
var controls = {
  value: 0,
  gcount: 13,
  ay = 0.6,
  fade = 0.99
}
var gui = new dat.GUI()
gui.add(controls,"gcount",0,30).step(1).onChange(function(value){})

//設定粒子初始值
class Particle{
  constructor(args){
    let def = {
      p: new Vec2(),
      v: new Vec2(1,0),
      a: new Vec2(),
      r: 10,
      color: "#fff"
    }
    //把初始值def跟args使用者參數做融合
    Object.assign(def,args) //擁有客製化版本
    Object.assign(this,def) //把客製化版本的初始值放到自己這物件上面
  }
  draw(){
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.beginPath()
    ctx.arc(0,0,this.r,0,Math.PI*2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
  update(){
    this.p = this.p.add(this.v)
    //速度等於上一個的速度加現在的加速度
    this.v = this.v.add(this.a)
    this.v.move(0,controls.ay)
    //讓球的速度衰減
    this.v = this.v.mul(0.99)
    this.r*= controls.fade

    if(this.p.y+this.r > wy){
      this.v.y = -Math.abs(this.v.y)
    }
    if(this.p.x+this.r > ww){
      this.v.x = -Math.abs(this.v.x)
    }
    if(this.p.y-this.r < 0 ){
      this.v.y = -Math.abs(this.v.y)
    }
    if(this.p.x-this.r < 0 ){
      this.v.x = -Math.abs(this.v.x)
    }
  }
}

//------------------------
// Vec2

class Vec2{
  constructor(x,y){
    this.x = x || 0
    this.y = y || 0 
  }
  set(x,y){
    this.x =x
    this.y =y
  }
  move(x,y){
    this.x+=x
    this.y+=y
  }
  add(v){
    return new Vec2(this.x+v.x,this.y+v.y)
  }
  sub(v){
    return new Vec2(this.x-v.x,this.y-v.y)
  }
  mul(s){
    return new Vec2(this.x*s,this.y*s)
  }
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }
  set length(nv){
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }
  clone(){
    return new Vec2(this.x,this.y)
  }
  toString(){
    return `(${this.x}, ${this.y})`
  }
  equal(v){
    return this.x==v.x && this.y ==v.y
  }
  get angle(){
    return Math.atan2(this.y,this.x)  
  }
  get unit(){
    return this.mul(1/this.length)
  }
  
}
var a = new Vec2(3,4)

//------



var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")
ctx.circle= function(v,r){
  this.arc(v.x,v.y,r,0,Math.PI*2)
}
ctx.line= function(v1,v2){
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}


function initCanvas(){
  ww = canvas.width = window.innerWidth
  wh = canvas.height = window.innerHeight
}
initCanvas()

//裝粒子的陣列
particles = []
function init(){
  
}
function update(){
  time++
  particles = particles.concat(Array.from({length: controls.gcount},(d,i)=>{
    return new Particle({
      // 讓他的位置是滑鼠位置的clone
      p: mousePos.clone(),
      //設定速度為隨機，-5是為了讓方向往左一半
      v: new Vec2(Math.random()*10-5,Math.random()*10-5)
    })
  }))
  particles.forEach(p=>{p.update()})
}
function draw(){
   //清空背景
  ctx.fillStyle=bgColor
  ctx.fillRect(0,0,ww,wh)
  
  //-------------------------
  //   在這裡繪製
  
  particles.forEach(p=>{p.draw()})
  
  
  //-----------------------
  //繪製滑鼠座標
  
  ctx.fillStyle="red"
  ctx.beginPath()
  ctx.circle(mousePos,2)
  ctx.fill()
  
  ctx.save()
  ctx.beginPath()
  ctx.translate(mousePos.x,mousePos.y)
    ctx.strokeStyle="red"
    let len = 20
    ctx.line(new Vec2(-len,0),new Vec2(len,0))
    ctx.line(new Vec2(0,-len),new Vec2(0,len))
    ctx.fillText(mousePos,10,-10)
    ctx.stroke()
    ctx.restore()
  
  //schedule next render

  requestAnimationFrame(draw)
}
function loaded(){
  initCanvas()
  init()
  requestAnimationFrame(draw)
  setInterval(update,1000/updateFPS)
}
window.addEventListener("load",loaded)
window.addEventListener("resize",initCanvas)

//滑鼠事件跟紀錄
var mousePos = new Vec2(0,0)
var mousePosDown = new Vec2(0,0)
var mousePosUp = new Vec2(0,0)

window.addEventListener("mousemove",mousemove)
window.addEventListener("mouseup",mouseup)
window.addEventListener("mousedown",mousedown)
function mousemove(evt){
  mousePos.set(evt.offsetX,evt.offsetY)
  // console.log(mousePos)
}
function mouseup(evt){
  mousePos.set(evt.offsetX,evt.offsetY)
  mousePosUp = mousePos.clone()
  
}
function mousedown(evt){
  mousePos.set(evt.offsetX,evt.offsetY)
  mousePosDown = mousePos.clone()
}