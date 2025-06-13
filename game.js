'use strict';
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const hudTime=document.getElementById('time');
const hudStars=document.getElementById('starCount');
const btnRight=document.getElementById('btnRight');
const btnJump=document.getElementById('btnJump');
const panel=document.getElementById('panel');
const final=document.getElementById('final');
const playBtn=document.getElementById('play');
const startPanel=document.getElementById('start-panel');
const startBtn=document.getElementById('start');
let running=false,last=0,pos=0,time=0,stars=0,baseSpeed=2,jumpT=0,slowT=0;
let objects=[],finish=5000;
let aiBikes=[];
function init(){
  panel.hidden=true;
  startPanel.hidden=false;
  draw();
}
function reset(){
  running=true;pos=0;time=0;stars=0;jumpT=0;slowT=0;objects=[];
  last=performance.now();
  for(let x=800;x<=finish;x+=800)objects.push({x,star:Math.random()<0.5,hit:false});
  aiBikes=[{pos:0,speed:2.3},{pos:0,speed:1.9}];
  panel.hidden=true;startPanel.hidden=true;
  draw();
  requestAnimationFrame(loop);
}
function jump(){if(!jumpT)jumpT=0.001;}
function update(dt){
  let speed=baseSpeed+(btnRightPressed?2:0);
  if(slowT>0){slowT-=dt;speed=1;}
  pos+=speed*100*dt;
  if(jumpT)jumpT+=dt;
  if(jumpT>0.3)jumpT=0;
  objects.forEach(o=>{
    if(!o.hit&&pos+300>o.x&&pos+300<o.x+40&&(!jumpT||o.star)){
      o.hit=true;
      if(o.star)stars++;else slowT=1;
    }
  });
  aiBikes.forEach(b=>{b.pos+=b.speed*100*dt;});
  if(pos>finish){
    running=false;
    panel.hidden=false;
    final.textContent=`Time: ${time.toFixed(1)}s Stars: ${stars}`;
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
  objects.forEach(o=>{
    let x=300-(o.x-pos);
    if(!o.hit&&x>-50&&x<650){
      ctx.font='24px serif';
      ctx.fillText(o.star?'⭐':'🪨',x,o.star?280:330);
    }
  });
  aiBikes.forEach(b=>{
    let x=300-(b.pos-pos);
    if(x>-50&&x<650){ctx.font='28px serif';ctx.fillText('🚲',x,300);}
  });
  ctx.font='32px serif';
  ctx.fillText('🚲',280,jumpT?250:300);
  hudTime.textContent=`Time: ${time.toFixed(1)}s`;
  hudStars.textContent=`Stars: ${stars}`;
}
let btnRightPressed=false;
btnRight.onpointerdown=()=>{btnRightPressed=true;};
btnRight.onpointerup=()=>{btnRightPressed=false;};
btnJump.onpointerdown=jump;
window.onkeydown=e=>{if(e.key==='ArrowRight')btnRightPressed=true;if(e.key==='ArrowUp')jump();};
window.onkeyup=e=>{if(e.key==='ArrowRight')btnRightPressed=false;};
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
init();
