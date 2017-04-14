"use strict";
function fireworksConsole(){
	var o=this;
	var fireworksArr=[];
	var substancesArr=[];
	function fireworkRun(){
		var tempMap=fireworksArr;
		fireworksArr=[];
		var temp=null;
		while(temp=tempMap.shift()){
			if(temp.run()){
				//console.log(substancesArr.length);
				temp.fireOpen(substancesArr);
			}else{
				fireworksArr.push(temp);
			}
		}
	};
	function substancesRun(){
		var tempMap=substancesArr;
		substancesArr=[];
		var temp=null;
		while(temp=tempMap.shift()){
			if(!temp.run()){
				substancesArr.push(temp);
			}
		}
	};
	o.init=function(){
		fireworksArr=[];
		substancesArr=[];
	}
	o.run=function(){
		fireworkRun();
		substancesRun();

	};
	o.fire=function(x,y,w,h,fireHeight){
		fireworksArr.push(new fireworksObj(x,y,w,h,fireHeight));
	}
	
}
function fireworksObj(x,y,w,h,fireHeight){
	var  o=this;

	Obj.call(o,x,game.ch-y,w,h);
	fireHeight=game.ch-fireHeight;
	var yspeed=-g*20;
	var og=g/1500; //重力
	function fireUp(){
		o.y+=yspeed;
		o.rect();
		yspeed+=og;
		return yspeed>=0?true:false; //速度向下，绽放烟火
	}
	o.run=function(){

		//超过指定，绽放烟火
		if(o.y<fireHeight){
			return true;
		}else{
			return fireUp();
		}
	}
	o.fireOpen=function(substancesArr){
		
		// TODO 烟火成分
		for (var i = 0; i <= 360; i+=30) {
			for (var timeout = 0; timeout <= 12; timeout+=4) {
				substancesArr.push(new substancesObj(o.x,o.y,-g*(16-timeout),i,timeout*100));
				substancesArr.push(new substancesObj(o.x,o.y,-g*(14-timeout),i+15,(timeout+2)*100));
			};
		};
	}
}
/**
* 烟火成分
* @param float x 初始x坐标
* @param float y 初始x坐标
* @param float speed 初始速度
* @param float angle 初始角度（角度）
* @param int timeout 延迟时间（毫秒）
*/
function substancesObj(x,y,speed,angle,timeout){
	var  o=this;
	Obj.call(o,x,y,3,3);
	timeout=timeout==undefined?0:timeout;
	angle=(angle==undefined?90:angle)*0.017453293;//将角度乘以 0.017453293 （2PI/360）即可转换为弧度
	var _run=1;
	var hue=0;
	var _timeout=1-timeout/2000;
	var xspeed=speed*Math.cos(angle);
	var yspeed=speed*Math.sin(angle);
	var og=g/6; //重力
	var oog=g/50; //重力
	o.run=function(){	
		_run-=runTime/2000;
		if(_run>_timeout){
			return false;
		}
		if(_run<=0){
			return true;
		}
		o.x+=xspeed;
		o.y+=yspeed;
		//o.log();
		o.rect(3,'hsl('+(hue+=2)+',100%,'+(_run*100+20)+'%)');
		yspeed+=og;
		xspeed*=0.99;
		//边缘检测
		if(o.x<-o.w||o.y<-o.h||o.x>game.cw||o.y>game.ch){
			return true;
		}else{
			return false;
		}
	}
}