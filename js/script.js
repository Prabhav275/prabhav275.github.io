(function(){
  var root=document.documentElement;
  root.classList.add('js');

  /* ---- theme toggle ---- */
  var tt=document.getElementById('themeToggle');
  function syncTheme(){
    if(!tt)return;
    tt.setAttribute('aria-pressed',root.getAttribute('data-theme')==='dark'?'true':'false');
  }
  try{
    var t=localStorage.getItem('pf-theme');
    if(t==='dark'||t==='light')root.setAttribute('data-theme',t);
  }catch(e){}
  syncTheme();
  if(tt){
    tt.addEventListener('click',function(){
      var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
      root.setAttribute('data-theme',next);
      try{localStorage.setItem('pf-theme',next);}catch(e){}
      syncTheme();
    });
  }

  /* ---- split hero name into letters ---- */
  var h1=document.getElementById('heroName');
  if(h1){
    var txt=h1.getAttribute('data-text')||h1.textContent.trim();
    h1.setAttribute('aria-label',txt);
    h1.textContent='';
    var frag=document.createDocumentFragment();
    for(var i=0;i<txt.length;i++){
      var ch=txt.charAt(i);
      var mask=document.createElement('span');
      mask.className='split-mask';
      var s=document.createElement('span');
      s.className='split-char';
      s.textContent=(ch===' ')?' ':ch;
      mask.appendChild(s);
      frag.appendChild(mask);
    }
    h1.appendChild(frag);
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var chars=h1.querySelectorAll('.split-char');
        for(var j=0;j<chars.length;j++){chars[j].style.transitionDelay=(j*36)+'ms';}
        h1.classList.add('in');
        var hero=h1.closest('.hero');
        setTimeout(function(){
          if(hero&&!hero.classList.contains('in'))hero.classList.add('in');
        },120);
      });
    });
  }

  /* ---- nav scrolled state ---- */
  var header=document.getElementById('siteHeader');
  function onScroll(){
    if(header)header.classList.toggle('scrolled',(window.scrollY||window.pageYOffset||0)>10);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  /* ---- scroll reveals ---- */
  var rv=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      for(var k=0;k<entries.length;k++){
        var en=entries[k];
        if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
      }
    },{rootMargin:'0px 0px -8% 0px',threshold:0.05});
    for(var m=0;m<rv.length;m++)io.observe(rv[m]);
  }else{
    for(var n=0;n<rv.length;n++)rv[n].classList.add('in');
  }

  /* ---- background starfield — scroll-evolves ---- */
  var bgCanvas=document.getElementById('bgCanvas');
  var bgCtx=bgCanvas?bgCanvas.getContext('2d'):null;
  if(bgCanvas&&bgCtx&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var stars=[],planets=[],comet=null,bigStars=[],W=0,H=0,rafC=null,accent='216,166,87',ink='242,239,232',dpr=1,prevY=0,scrollP=0,time=0,cometTimer=200;

    /* planet spec: normalized pos/radius + palettes + scroll orbit */
    var PLANET_SPECS=[
      {nx:0.14,ny:0.13,nr:0.075,ring:true,orb:0.17,orbSpeed:0.85,c1:'226,180,120',c2:'150,130,105'},
      {nx:0.84,ny:0.2,nr:0.05,ring:false,orb:0.13,orbSpeed:-0.65,c1:'120,160,230',c2:'70,90,170'},
      {nx:0.76,ny:0.8,nr:0.065,ring:false,orb:0.11,orbSpeed:1.1,c1:'170,140,210',c2:'95,70,150'}
    ];
    var BIG_SPECS=[
      {nx:0.28,ny:0.3,tr:4.5},{nx:0.66,ny:0.6,tr:3.6},{nx:0.44,ny:0.72,tr:3},{nx:0.9,ny:0.5,tr:3.4}
    ];

    function readCols(){
      var cs=getComputedStyle(document.documentElement);
      function r(hex){
        hex=(hex||'#000').replace('#','');if(hex.length===3)hex=hex.split('').map(function(c){return c+c}).join('');
        return parseInt(hex.substr(0,2),16)+','+parseInt(hex.substr(2,2),16)+','+parseInt(hex.substr(4,2),16);
      }
      accent=r(cs.getPropertyValue('--accent'));
      ink=r(cs.getPropertyValue('--ink'));
    }
    readCols();

    var obs=new MutationObserver(function(){
      if(document.documentElement.getAttribute('data-theme')){readCols();}
    });
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

    function countStars(){return Math.max(60,Math.min(200,Math.floor(W/8)));}
    function spawnStar(randY,rndSize){
      var z=0.3+Math.random()*0.7;
      stars.push({
        x:Math.random()*W,
        y:randY?Math.random()*H:H+20,
        r:rndSize?0.7+Math.random()*2:0.8+Math.random()*1.3,
        z:z,
        driftX:(Math.random()-0.5)*0.08,
        driftY:-(0.02+Math.random()*0.08),
        twinkle:0.15+Math.random()*0.5,
        twinklePh:Math.random()*Math.PI*2,
        baseAlpha:0.4+Math.random()*0.5,
        sub:Math.random()<0.25
      });
    }
    function fit(){
      dpr=window.devicePixelRatio||1;
      W=window.innerWidth;H=window.innerHeight;
      bgCanvas.width=W*dpr;bgCanvas.height=H*dpr;
      bgCanvas.style.width=W+'px';bgCanvas.style.height=H+'px';
      bgCtx.setTransform(dpr,0,0,dpr,0,0);
      var n=countStars();
      while(stars.length>n){stars.pop();}
      while(stars.length<n){spawnStar(true,true);}
      var k;
      for(k=0;k<PLANET_SPECS.length;k++){
        if(!planets[k])planets[k]={ph:Math.random()*6.28};
        planets[k].x=PLANET_SPECS[k].nx*W;
        planets[k].y=PLANET_SPECS[k].ny*H;
        planets[k].r=PLANET_SPECS[k].nr*Math.min(W,H);
      }
      for(k=0;k<BIG_SPECS.length;k++){
        if(!bigStars[k])bigStars[k]={ph:Math.random()*6.28,ph2:Math.random()*6.28};
        bigStars[k].x=BIG_SPECS[k].nx*W;
        bigStars[k].y=BIG_SPECS[k].ny*H;
        bigStars[k].tr=BIG_SPECS[k].tr*Math.min(W,H)/900;
      }
      if(!comet)comet={x:0,y:0,vx:0,vy:0,life:0,on:false,trail:[]};
    }
    function lerpRGB(a,b,t){
      var aa=a.split(',').map(Number),bb=b.split(',').map(Number);
      return Math.round(aa[0]+(bb[0]-aa[0])*t)+','+Math.round(aa[1]+(bb[1]-aa[1])*t)+','+Math.round(aa[2]+(bb[2]-aa[2])*t);
    }
    function shade(c,f){ /* f>0 lighten toward white, f<0 darken toward black */
      var p=c.split(',').map(Number),o=[];
      for(var i=0;i<3;i++){o[i]=f>=0?Math.round(p[i]+(255-p[i])*f):Math.round(p[i]*(1+f));}
      return o[0]+','+o[1]+','+o[2];
    }
    function fireComet(){
      comet.on=true;comet.life=0;comet.trail=[];
      var fromLeft=Math.random()<0.5,fromTop=Math.random()<0.6;
      if(fromTop){
        comet.y=-20;
        comet.x=W*(0.15+Math.random()*0.7);
        comet.vx=(Math.random()<0.5?-1:1)*(0.35+Math.random()*0.4);
        comet.vy=0.9+Math.random()*0.7;
      }else{
        comet.y=H*(0.2+Math.random()*0.5);
        comet.x=fromLeft?-20:W+20;
        comet.vx=(fromLeft?1:-1)*(0.8+Math.random()*0.5);
        comet.vy=0.25+Math.random()*0.3;
      }
    }
    function drawComet(){
      if(comet.on){
        comet.x+=comet.vx;comet.y+=comet.vy;comet.life++;
        comet.trail.push({x:comet.x,y:comet.y});
        if(comet.trail.length>60)comet.trail.shift();
        var overX=comet.x<-140||comet.x>W+140,overY=comet.y<-140||comet.y>H+140;
        if(overX||overY||comet.life>600){comet.on=false;comet.trail=[];cometTimer=260+Math.random()*420;}
        var head='235,245,255';
        for(var i=0;i<comet.trail.length;i++){
          var f=i/comet.trail.length,seg=comet.trail[i];
          bgCtx.globalAlpha=f*f*0.5;
          bgCtx.fillStyle='rgb('+(f>0.6?head:lerpRGB('190,140,90',head,f))+')';
          bgCtx.beginPath();
          bgCtx.arc(seg.x,seg.y,Math.max(0.4,f*3.2),0,Math.PI*2);
          bgCtx.fill();
        }
        bgCtx.globalAlpha=0.9;
        bgCtx.shadowColor='rgba(235,245,255,0.9)';
        bgCtx.shadowBlur=16;
        bgCtx.fillStyle='rgb('+head+')';
        bgCtx.beginPath();
        bgCtx.arc(comet.x,comet.y,2.6,0,Math.PI*2);
        bgCtx.fill();
        bgCtx.shadowBlur=0;
      }else{
        cometTimer--;
        if(cometTimer<=0)fireComet();
      }
      bgCtx.globalAlpha=1;
    }
    function drawBigStars(col){
      for(var k=0;k<bigStars.length;k++){
        var bs=bigStars[k],spec=BIG_SPECS[k];
        bs.x=spec.nx*W+Math.sin(time*0.0002+bs.ph)*8;
        bs.y=spec.ny*H+Math.cos(time*0.00016+bs.ph2)*6;
        var glow=0.35+0.3*Math.sin(time*0.001+bs.ph);
        var rr=bs.tr*(0.9+0.25*Math.sin(time*0.0012+bs.ph));
        bgCtx.globalAlpha=glow;
        bgCtx.shadowColor='rgba('+col+',0.8)';
        bgCtx.shadowBlur=18;
        bgCtx.fillStyle='rgb('+col+')';
        bgCtx.beginPath();
        bgCtx.arc(bs.x,bs.y,rr,0,Math.PI*2);
        bgCtx.fill();
        bgCtx.shadowBlur=0;
        bgCtx.globalAlpha=glow*0.5;
        var flare=rr*3.4;
        bgCtx.fillRect(bs.x-flare/2,bs.y-0.6,flare,1.2);
        bgCtx.fillRect(bs.x-0.6,bs.y-flare/2,1.2,flare);
        bgCtx.globalAlpha=1;
      }
    }
    function drawPlanet(p,spec,col,minDim){
      var orbitA=p.ph+scrollP*spec.orbSpeed*Math.PI*2;
      var orbR=spec.orb*minDim;
      var cx=p.x+Math.cos(orbitA)*orbR+Math.sin(time*0.0003+p.ph)*6;
      var cy=p.y+Math.sin(orbitA)*orbR*0.55+Math.cos(time*0.00024+p.ph*1.3)*5;
      var R=p.r;

      /* orbit ring */
      bgCtx.globalAlpha=0.16;
      bgCtx.strokeStyle='rgba('+col+',1)';
      bgCtx.lineWidth=1;
      bgCtx.setLineDash([2,6]);
      bgCtx.beginPath();
      bgCtx.ellipse(cx,cy,R*2.4,R*0.7,0,0,Math.PI*2);
      bgCtx.stroke();
      bgCtx.setLineDash([]);

      /* soft glow */
      var grd=bgCtx.createRadialGradient(cx,cy,R*0.4,cx,cy,R*2.2);
      grd.addColorStop(0,'rgba('+col+',0.14)');
      grd.addColorStop(1,'rgba('+col+',0)');
      bgCtx.globalAlpha=1;
      bgCtx.fillStyle=grd;
      bgCtx.beginPath();
      bgCtx.arc(cx,cy,R*2.2,0,Math.PI*2);
      bgCtx.fill();

      /* body gradient — lit from top-left */
      var bg2=bgCtx.createRadialGradient(cx-R*0.4,cy-R*0.45,R*0.1,cx,cy,R);
      bg2.addColorStop(0,'rgb('+shade(col,0.4)+')');
      bg2.addColorStop(0.55,'rgb('+col+')');
      bg2.addColorStop(1,'rgb('+shade(col,-0.55)+')');
      bgCtx.globalAlpha=0.95;
      bgCtx.fillStyle=bg2;
      bgCtx.beginPath();
      bgCtx.arc(cx,cy,R,0,Math.PI*2);
      bgCtx.fill();

      /* darker crescent on bottom edge for depth */
      bgCtx.save();
      bgCtx.globalAlpha=0.22;
      bgCtx.fillStyle='rgb('+shade(col,-0.7)+')';
      bgCtx.beginPath();
      bgCtx.arc(cx,cy,R,0,Math.PI*2);
      bgCtx.clip();
      bgCtx.beginPath();
      bgCtx.arc(cx+R*0.6,cy+R*0.15,R*1.5,0,Math.PI*2);
      bgCtx.fill();
      bgCtx.restore();

      /* Saturn ring across */
      if(spec.ring){
        bgCtx.save();
        bgCtx.translate(cx,cy);
        bgCtx.rotate(-0.42);
        bgCtx.globalAlpha=0.5;
        bgCtx.fillStyle='rgba('+shade(col,0.15)+',0.9)';
        bgCtx.scale(1,0.36);
        bgCtx.beginPath();
        bgCtx.arc(0,0,R*1.55,0,Math.PI*2);
        bgCtx.fill();
        bgCtx.globalAlpha=1;
        bgCtx.restore();
      }
      bgCtx.globalAlpha=1;
    }
    function loop(){
      bgCtx.clearRect(0,0,W,H);
      time++;
      var sy=window.scrollY||0,delta=sy-prevY;prevY=sy;
      scrollP=sy/Math.max(1,(document.body.scrollHeight||1)-window.innerHeight);
      scrollP=Math.min(1,Math.max(0,scrollP));

      var warm='242,239,232',cool='160,200,255';
      var col1=lerpRGB(warm,cool,scrollP);
      var col2=lerpRGB(accent,'110,165,235',scrollP);

      var minDim=Math.min(W,H);

      /* nebula blobs — very faint, shift with scroll */
      var nb=0.06+scrollP*0.05;
      for(var b=0;b<3;b++){
        var bx=W*(0.25+b*0.25+Math.sin(sy*0.0003+b*2)*0.1);
        var by=H*(0.2+b*0.3+Math.cos(sy*0.0002+b*1.5)*0.15);
        var grd=bgCtx.createRadialGradient(bx,by,0,bx,by,Math.min(W,H)*0.4);
        var c=b===0?col2:(b===1?lerpRGB(accent,'130,150,230',scrollP*0.7):lerpRGB(warm,cool,scrollP*0.5));
        grd.addColorStop(0,'rgba('+c+','+nb+')');
        grd.addColorStop(1,'rgba('+c+',0)');
        bgCtx.fillStyle=grd;
        bgCtx.fillRect(0,0,W,H);
      }

      /* small stars */
      for(var i=0;i<stars.length;i++){
        var s=stars[i];
        s.y+=s.driftY+s.z*delta*0.12;
        s.x+=s.driftX+s.z*delta*0.04;
        s.twinklePh+=s.twinkle*0.025;
        if(s.y<-12||s.y>H+12||s.x<-12||s.x>W+12){s.x=Math.random()*W;s.y=0;}
        var tw=0.5+0.5*Math.sin(s.twinklePh);
        var alpha=s.baseAlpha*tw*(0.6+scrollP*0.4);
        var col=s.sub?col2:col1;
        var size=s.r+scrollP*0.7;
        bgCtx.globalAlpha=alpha*0.7;
        bgCtx.fillStyle='rgb('+col+')';
        bgCtx.beginPath();
        bgCtx.arc(s.x,s.y,size,0,Math.PI*2);
        bgCtx.fill();
        if(s.r>1.5){
          bgCtx.shadowColor='rgba('+col+','+(alpha*0.3)+')';
          bgCtx.shadowBlur=7;
          bgCtx.fill();
          bgCtx.shadowBlur=0;
        }
      }

      /* planets (drawn after stars so they sit in front) */
      for(var p2=0;p2<planets.length;p2++){
        var spec=PLANET_SPECS[p2];
        var pcol=lerpRGB(spec.c1,spec.c2,scrollP*0.5);
        drawPlanet(planets[p2],spec,pcol,minDim);
      }

      /* big twinkling stars with cross flare */
      drawBigStars(col1);

      /* comet */
      drawComet();

      bgCtx.globalAlpha=1;
      rafC=requestAnimationFrame(loop);
    }
    fit();
    loop();
    window.addEventListener('resize',function(){fit();});
    document.addEventListener('visibilitychange',function(){
      if(document.hidden&&rafC){cancelAnimationFrame(rafC);rafC=null;}
      else if(!document.hidden&&!rafC){loop();}
    });
  }else if(bgCanvas){bgCanvas.style.display='none';}
})();
