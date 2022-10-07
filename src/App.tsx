import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {observable, observer} from "proxily";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class Circle {
  xPos = 0;
  yPos = 0;
  width = 0;
  xMove = 0;
  yMove = 0;
  constructor (xPos : number, yPos : number, width : number, xMove : number, yMove : number) {
    this.xPos= xPos;
    this.yPos = yPos;
    this.width = width;
    this.xMove = xMove;
    this.yMove = yMove;
  }
  move(height : number, width : number) {
    this.xPos += this.xMove * 10;
    this.yPos += this.yMove * 10;
    if (this.xPos + this.width > width || this.xPos < 0 ||
        this.yPos + this.width > height || this.yPos < 0) {
      this.xMove = - this.xMove;
      this.yMove = - this.yMove;
    }
  }
}
class Data {
  circles : Array<Circle> = [];
  fillCircles() {
    this.circles = [];
    while(this.circles.length < this.quantity) {
      const xPos = Math.floor(Math.random() * this.screenWidth);
      const yPos = Math.floor(Math.random() * this.screenHeight);
      if (!this.circles.find(circle => isCircleOverlapping(circle.xPos, circle.yPos, xPos, yPos, this.size)) &&
          xPos + this.size < this.screenWidth && yPos + this.size < this.screenHeight)
        this.circles.push(new Circle(xPos, yPos, this.size, Math.random(), Math.random()));
    }
  }
  remove (ix : number) {
    this.circles.splice(ix, 1);
    if (this.circles.length === 0)
      this.fillCircles();
  }
  move () {
    this.circles.forEach(circle => circle.move(this.screenHeight, this.screenWidth))
  }
  screenWidth = 1024;
  screenHeight = 1024;
  size = 100;
  quantity = 10;
  speed = 0;
}
let newSize = 100;
const data = observable(new Data);

function App() {

  useEffect( () => {
    handleWindowResize();
    data.fillCircles();
    setInterval(() => {
      if (data.size != newSize) {
        data.size = newSize;
        data.fillCircles()
      }
    }, 1000);
    function handleWindowResize() {
      const s = getWindowSize();
      data.screenHeight = s.innerHeight * .9;
      data.screenWidth = s.innerWidth;
      data.size =data.screenWidth / 10;
      data.fillCircles();
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
   <div className="App">
     <div className="Top">
       <div className="BallsContainer">
         &nbsp;
         {data.circles.map((circle, ix) =>
             <div onClick={() => data.remove(ix)} className="Circle" style={{left: circle.xPos, top: circle.yPos, width: circle.width, height: circle.width}} >&nbsp;</div>
         )}
       </div>
     </div>
     <div className="Bottom">
        <Slider className="Slider" min={50} max={200} value={newSize} onChange={(v) => newSize = v instanceof Array ? v[0] : v} />
     </div>
   </div>
  );
}
export default observer(App);

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

function isRectOverlapping(x1 : number, y1 : number, x2 : number, y2: number, s : number) {
  return !(x1 + s < x2 || y1 + s < y2 || x1 > x2 + s || y1 > y2 + s);
}
function isCircleOverlapping(x1 : number, y1 : number, x2 : number, y2: number, s : number) {
  const r = s / 2;
  var DistanceX = x1 - x2;
  var DistanceY = y1 - y2;
  var DistanceCenter = Math.sqrt(DistanceX * DistanceX + DistanceY * DistanceY);
  var CollisionDistance = r;
  if (r) CollisionDistance += r
  return DistanceCenter <= CollisionDistance
}
