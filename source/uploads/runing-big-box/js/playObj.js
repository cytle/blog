"use strict";
/**
 * Obj 游戏对象
 *******************************
 * @param x 初始x坐标
 * @param y 初始y坐标
 * @param w 宽度
 * @param h 高度
 * @param xspeed 初始x速度
 * @param yspeed 初始y速度
 *******************************
 * @return Obj 游戏对象
 */
 function Obj(x,y,w,h,xspeed,yspeed){
	/*
	console.log("call Obj");*/

	this.x=x?x:0;
	this.y=y?y:0;
	this.w=w?w:0;
	this.h=h?h:0;
	this.xspeed=xspeed?xspeed:0;
	this.yspeed=yspeed?yspeed:0;
	this.is_delete=false;
	this.lx=this.x;
	this.ly=this.y;
	this.rect=function(type,style){
		game.draw({x:this.x,y:this.y,lx:this.lx,ly:this.ly,w:this.w,h:this.h,type:type?type:0,style:style?style:-1});
		this.lx=this.x;
		this.ly=this.y;
	};
	this.log=function(){
		console.log(this.constructor.name+"  "+"x:"+this.x+"y:"+this.y);
	}
}


/**
 * playObj 玩家对象
 *******************************
 * @param x 初始x坐标
 * @param y 初始y坐标
 * @param w 宽度
 * @param h 高度
 * @param xspeed 初始x速度
 * @param yspeed 初始y速度
 *******************************
 * @return playObj 玩家对象
 */
 function playObj(){

 	var o=this;
 	Obj.call(o,0,0,playerW,playerH);//效果类似继承，再调用父类方法
 	o.moveX=0;//加速
 	o.moveY=0;//加速
 	o.yspeedUp;
 	o.xspeedUp;
 	o.sixLine;
 	var is_ysup=false;  //检查上下是否按下
 	var is_xsup=false;	//检查左右是否按下
 	o.hp=0;
 	o.setKeyDown=function(direction){
 		switch(direction){ 
 			case 3:if(is_xsup){break};is_xsup=true;o.xspeedUp=setInterval(function(){o.moveX+=g},runTime);break; 
 			case 2:if(is_ysup){break};is_ysup=true;o.yspeedUp=setInterval(function(){o.moveY-=g},runTime);break; 
 			case 1:if(is_xsup){break};is_xsup=true;o.xspeedUp=setInterval(function(){o.moveX-=g},runTime);console.log(1);break; 
 			default:console.error("playObj setKeyDown switch default value:"+direction);
 		}
 	};

 	o.setKeyUp=function(direction){
 		switch(direction){ 
 			case 3:clearInterval(o.xspeedUp);is_xsup=false;break; 
 			case 2:clearInterval(o.yspeedUp);is_ysup=false;break; 
 			case 1:clearInterval(o.xspeedUp);is_xsup=false;break; 
 			default:console.error("playObj setKeyUp switch default value:"+direction);
 		}
 	};
 	o.injure=function(zd){
 		if(game.isOver()){
 			return;
 		}
 		o.hp-=10;

 		if(o.hp<=0){
 			o.hp=0;
 			setHp(o.hp);
 			game.over(false);
 		}

 		setHp(o.hp);
 		//setHistory();
 		console.log("injure");
 		o.xspeed+=zd.xspeed*0.9;
 		o.yspeed+=zd.yspeed*0.9;
 	};
 	o.run=function(){

 		if(game.isOver()){
 			o.rect();
 			return;
 		}

 		if(o.hp<100){
 			o.hp+=runTime/1000;
 			setHp(o.hp);
 		}else{
 			game.over(true);
 		}
 		
 		o.yspeed+=o.moveY+g/2;
 		o.moveY=0;
 		o.xspeed+=o.moveX;
 		o.moveX=0;
 		
 		o.xspeed+=(o.xspeed>0?-0.01:0.01);


		//限制最高速度
		if(o.xspeed>=speedMax){
			o.xspeed=speedMax;
		}else if(o.xspeed<=-speedMax){
			o.xspeed=-speedMax;
		}
		if(o.yspeed>=speedMax){
			o.yspeed=speedMax;
		}else if(o.yspeed<=-speedMax){
			o.yspeed=-speedMax;
		}
		


		//到达顶部
		if(o.y<10){
			o.yspeed*=(-0.3);
			o.y=10;
		}else if(o.y>game.ch-o.h){
			o.yspeed*=(-0.3);
			o.y=game.ch-o.h;
		}
		o.y+=o.yspeed;

		if(o.x>game.cw-o.w){
			o.xspeed*=(-0.3);
			o.x=game.cw-o.w;
		}else if(o.x<0){
			o.xspeed*=(-0.3);
			o.x=0;
		}
		o.x+=o.xspeed;

		o.sixLine=getSixLine(o.x,o.y,o.lx,o.ly,o.w,o.h);
		o.rect();
	};
	o.init=function(){

		clearInterval(o.xspeedUp);
		clearInterval(o.yspeedUp);

		o.x=(game.cw-o.w)/2;
		o.y=(game.ch-o.h)/2;
		o.rect();
		o.moveX=0;
		o.moveY=0;
		o.yspeed=0;
		o.xspeed=0;
		o.hp=0;
		setHp(o.hp);
	};
	function setHp(h){
		hp.style.width=h+"%";
	}
	function setHistory(){
		//injure_history.innerHTML=injure_history.innerHTML+"<br>injure:x:"+aPlayerX+" y:"+aPlayerY;

	}
}

function zdObj(m,timeout){
	var o=this;
	o.timeout=timeout;
	o.speed=(m.type==1)?100*g:70*g;
	o.oo=m;
	Obj.call(o,m.x,m.y,4-m.type,4-m.type);//效果类似继承，再调用父类方法
	o.no_fired=true;
	//子弹定位，mx，my目标位置
	o.dw=function(mx,my){

		o.x=o.oo.x+0.5*o.oo.w;
		o.y=o.oo.y+0.5*o.oo.h;
		my=my>game.ch-60?game.ch-60:my;
		var cx=mx-o.x;
		var cy=(my-o.y)*(Math.random()*0.5+0.8);
		var cxy=Math.sqrt(cx*cx+cy*cy);
		o.xspeed=o.speed*cx/cxy;
		o.yspeed=o.speed*cy/cxy;
	}

	o.check=function(){

		if(o.timeout>=0){
			o.timeout-=runTime;
			return 0;
		}
		if(o.no_fired){
			o.dw(game.getPlayer().x,game.getPlayer().y);
			o.no_fired=false;
		}

		o.x+=o.xspeed;
		o.y+=o.yspeed;
		if(is_boom(o,game.getPlayer())){
			return 1;
		}
		o.rect();
		o.yspeed+=g/15; //子弹重力
		//console.log("zd"+o.y);

		//边缘检测
		if(o.x<-o.w||o.y<-o.h||o.x>game.cw||o.y>game.ch){
			return 2;
		}else{
			return 0;
		}
	}
}


function enemyObj(x,y,w,h,xspeed,yspeed){
	var o=this;
	Obj.call(o,x,y,w,h,xspeed,yspeed);//效果类似继承，再调用父类方法
	
	//发射子弹
	o.fire=function(){
		//结束了，就不再发子弹
		if(game.isOver()||o.is_delete) return;
		
		game.addZd(o);
		setTimeout(function(){
			o.fire();
		},4000+Math.random()*1000-o.type*2000);
	}
	
}
function tankObj(){
	var o=this;
	enemyObj.call(o,Math.ceil(Math.random()*2)*game.cw-game.cw,game.ch-15,30,15);//效果类似继承，再调用父类方法
	o.type=0;
	o.run=function(){
		//边界检测
		if(o.x<-o.w){
			o.xspeed=Math.random()*100*g;
		}else if(o.x>game.cw){
			//console.log(o.x)
			o.xspeed=-Math.random()*100*g;
		}

		//移动
		o.x+=o.xspeed;

		//阻力减速
		o.xspeed+=(o.xspeed>0?-g/10:g/10);
		if(Math.abs(o.xspeed)<=g/10){
			o.xspeed=(70-Math.random()*140)*g;
		}

		o.rect();
	}
	o.fire();
	
}
function planeObj(){
	var o=this;
	o.type=1;
	var s=Math.ceil(Math.random()*2)-1;
	//console.log(s);
	enemyObj.call(o,s*game.cw,Math.random()*game.ch/3+100,30,10,(1-s*2)*400/rFtp);//效果类似继承，再调用父类方法

	o.run=function(){
		//边界检测
		if(o.x<-o.w||o.x>game.cw){
			s=1-s;
			o.xspeed=(1-s*2)*400/rFtp;
		}
		o.x+=o.xspeed;
		o.rect(s+1);
	}
	setTimeout(function(){
		o.fire(1);
	},Math.random()*1000);
	
}