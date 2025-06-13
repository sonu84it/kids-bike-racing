'use strict';
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const hudTime=document.getElementById('time');
const hudSpeed=document.getElementById('speed');
const btnLeft=document.getElementById('btnLeft');
const btnRight=document.getElementById('btnRight');
const btnUp=document.getElementById('btnUp');
const btnDown=document.getElementById('btnDown');
const panel=document.getElementById('panel');
const final=document.getElementById('final');
const playBtn=document.getElementById('play');
const startPanel=document.getElementById('start-panel');
const startBtn=document.getElementById('start');
let running=false,last=0,pos=0,time=0,speed=2,playerX=0;
const finish=5000;
let aiRacers=[];
let leftPressed=false,rightPressed=false,upPressed=false,downPressed=false;
function init(){
  panel.hidden=true;
  startPanel.hidden=false;
  draw();
}
function reset(){
  running=true;
  pos=0;
  time=0;
  speed=2;
  playerX=0;
  last=performance.now();
  aiRacers=[{pos:200,lane:-100,speed:2.5},{pos:-300,lane:100,speed:2.2}];
  panel.hidden=true;
  startPanel.hidden=true;
  document.getElementById('panel-title').textContent='You Win!';
  draw();
  requestAnimationFrame(loop);
}
function update(dt){
  if(leftPressed) playerX=Math.max(playerX-200*dt,-250);
  if(rightPressed) playerX=Math.min(playerX+200*dt,250);
  if(upPressed) speed=Math.min(speed+1*dt,5);
  if(downPressed) speed=Math.max(speed-1*dt,1);

  pos+=speed*100*dt;
  aiRacers.forEach(r=>{r.pos+=r.speed*100*dt;});

  aiRacers.forEach(r=>{
    let dx=(300+playerX)-(300-(r.pos-pos)+r.lane);
    if(Math.abs(dx)<20 && Math.abs(r.pos-pos)<20){
      running=false;
      document.getElementById('panel-title').textContent='Game Over';
      final.textContent=`You crashed after ${(pos/100).toFixed(0)}m`;
      panel.hidden=false;
    }
  });

  if(pos>=finish && running){
    running=false;
    document.getElementById('panel-title').textContent='You Win!';
    final.textContent=`Time: ${time.toFixed(1)}s`;
    panel.hidden=false;
  }
}
function draw(){
  ctx.clearRect(0,0,600,400);
  ctx.fillStyle='#9be8f9';ctx.fillRect(0,0,600,250);
  ctx.fillStyle='#8fd400';ctx.fillRect(0,250,600,50);
  ctx.fillStyle='#7c543e';ctx.fillRect(0,300,600,100);
  ctx.strokeStyle='#fff';ctx.setLineDash([20,20]);
  ctx.beginPath();ctx.moveTo(0,330);ctx.lineTo(600,330);ctx.stroke();
  ctx.setLineDash([]);

  const finishX=300-(finish-pos);
  if(finishX>0&&finishX<600){
    ctx.fillStyle='#fff';
    ctx.fillRect(finishX,300,4,100);
  }

  ctx.fillStyle='#00f';
  aiRacers.forEach(r=>{
    const x=300-(r.pos-pos)+r.lane;
    if(x>-20&&x<620)ctx.fillRect(x-10,280,20,20);
  });

  ctx.fillStyle='#f00';
  ctx.fillRect(300+playerX-10,280,20,20);

  hudTime.textContent=`Time: ${time.toFixed(1)}s`;
  hudSpeed.textContent=`Speed: ${speed.toFixed(1)}`;
}
btnLeft.onpointerdown=()=>{leftPressed=true;};
btnLeft.onpointerup=()=>{leftPressed=false;};
btnRight.onpointerdown=()=>{rightPressed=true;};
btnRight.onpointerup=()=>{rightPressed=false;};
btnUp.onpointerdown=()=>{upPressed=true;};
btnUp.onpointerup=()=>{upPressed=false;};
btnDown.onpointerdown=()=>{downPressed=true;};
btnDown.onpointerup=()=>{downPressed=false;};

window.onkeydown=e=>{
  if(e.key==='ArrowLeft')leftPressed=true;
  if(e.key==='ArrowRight')rightPressed=true;
  if(e.key==='ArrowUp')upPressed=true;
  if(e.key==='ArrowDown')downPressed=true;
};
window.onkeyup=e=>{
  if(e.key==='ArrowLeft')leftPressed=false;
  if(e.key==='ArrowRight')rightPressed=false;
  if(e.key==='ArrowUp')upPressed=false;
  if(e.key==='ArrowDown')downPressed=false;
};
playBtn.onclick=reset;
startBtn.onclick=reset;
function loop(t){
  if(!running)return;
  let dt=(t-last)/1000;last=t;
  if(document.hidden){requestAnimationFrame(loop);return;}
  time+=dt;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
window.onload=init;
