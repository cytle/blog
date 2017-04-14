"use strict";
function gameConsole(){

	var o=this;
	var enemyMap = []; 		//敌人集
	var zdMap = []; 		//敌人集

	var intervalD ;			//执行游戏运行的定时器
	var intervalRZ ;		//定时执行产生敌人的定时器
	var intervalFW ;		//定时执行产生烟花的定时器
	var fireZD=0;			///该局发射子弹数量
	var boomZD=0;			//该局击中子弹数量
	var is_win=true;		//是否胜利
	var is_over=false;		//是否结束
	o.gameCanvas;		/*初始画布*/
	o.cw=0;
	o.ch=0;
	var aPlayer;	//玩家对象
	var fireworks;		/*初始烟花管理*/

	var fps_num=0;
	
	o.init=function(){
		
		/*var d=[40,40,50,15,1];	*/
		o.gameCanvas=new canvasConsole("myCanvas"); 
		o.cw=o.gameCanvas.getWidth();
		o.ch=o.gameCanvas.getHeight();
		aPlayer=new playObj();
		fireworks=new fireworksConsole(); 
		window.setInterval(setInfo,1000); 			//显示帧数定时器

		//改变方向 
		document.onkeydown = function(e) {
			var code=-1;
			switch(e.keyCode){
				case 65:;
				case 37:code=1;
				break;
				case 87:;
				case 38:code=2;
				break;
				case 68:;
				case 39:code=3;
				break;
			}

			if(code!=-1){
				aPlayer.setKeyDown(code);
				return;
			}
		}
		
		//改变方向 
		document.onkeyup = function(e) { 
			var code=-1;
			switch(e.keyCode){
				case 65:;
				case 37:code=1;
				break;
				case 87:;
				case 38:code=2;
				break;
				case 68:;
				case 39:code=3;
				break;
			}

			if(code!=-1){
				aPlayer.setKeyUp(code);
				return;
			}
			if(e.keyCode==82){
				o.start();
			}
		}
		return o;
	}
	/*游戏开始*/
	o.start=function(){
		var temp;
		while(temp=enemyMap.shift()){
			temp.is_delete=true;
		}

		aPlayer.init();
		zdMap=[];
		game_over.style.display="none";
		clearInterval(intervalFW);
		cancelAnimationFrame(intervalD);
		clearInterval(intervalRZ);
		fireZD=0;
		boomZD=0;
		is_over=false;
		intervalD = requestAnimationFrame(gameRun);
		intervalRZ = window.setInterval(rand_tank,4000);

	};
	o.addZd=function(enemy){
		fireZD+=5;
		zdMap.push(new zdObj(enemy,0));
		zdMap.push(new zdObj(enemy,100));
		zdMap.push(new zdObj(enemy,170));
		zdMap.push(new zdObj(enemy,220));
		zdMap.push(new zdObj(enemy,300));
	}
	o.isOver=function(){
		return is_over;
	}
	o.getPlayer=function(){
		return aPlayer;
	}
	/*游戏进行一帧*/
	function gameRun(){
		fps_num++;
		intervalD=requestAnimationFrame(gameRun);
		aPlayer.run();
		enemyRun();
		if(!is_over) 
			zdRun();
		else if(is_win)
			fireworks.run();
		o.gameCanvas.drawC();
		/*敌人运动*/
		function enemyRun(){
			var tempMap=enemyMap;
			enemyMap=[];
			var temp=null;

			while(temp=tempMap.shift()){
				temp.run();
				enemyMap.push(temp);
			}

		};
		/*子弹运动*/
		function zdRun(){
			var tempMap=zdMap;
			zdMap=[];
			var temp=null;
			while(temp=tempMap.shift()){
				switch(temp.check()){
					case 0:zdMap.push(temp);break;
					case 1:aPlayer.injure(temp);temp=null;boomZD+=1;break;
					case 2:break;
				}
			}
		};
	};
	/*在网页上显示游戏运行信息*/
	function setInfo(){
		fps.innerHTML="fps:"+fps_num;
		fps_num=0;
		zdAmount.innerHTML="子弹数量:"+zdMap.length+"|"+boomZD+"/"+fireZD;
	};

	/*增加坦克*/
	function rand_tank(){
		enemyMap.push(new tankObj());
		if(enemyMap.length>5){
			clearInterval(intervalRZ);
			intervalRZ=window.setInterval(rand_plane,8000);
		}
	};
	/*增加飞机*/
	function rand_plane(){
		enemyMap.push(new planeObj());
		if(enemyMap.length>8){
			clearInterval(intervalRZ);
		}
	};
	/*游戏结束*/
	o.over=function(_is_win){
		is_over=true;
		is_win=_is_win
		aPlayer.init();

		if(is_win){
			fireworksStart();
		}
		var temp;
		while(temp=zdMap.shift()){
			temp.is_delete=true;
		};

		game_over.style.display="block";
		game_over.innerHTML='<div id="result"><span id="result_say">'+(is_win?"Win!":"Lose!")+'</span> <small>按R键重新开始</small></div>';
	};
	o.getGameCanvas=function(){
		return o.gameCanvas;
	}
	/*游戏帮助*/
	o.help=function(){
		is_over=true;
		aPlayer.init();
		var temp;
		while(temp=zdMap.shift()){
			temp.is_delete=true;
		};
		fireworksStart();
		game_over.style.display="block";
		//game_over.innerHTML='<div id="result"><span id="result_say">'+(is_win?"Win!":"Lose!")+'</span> <small>按R键重新开始</small></div>';
	};
	function fireworksStart(){
		fireworks.init();
		intervalFW = window.setInterval(function(){
			var _h=random(o.ch*0.2,o.ch*0.6);
			fireworks.fire(random(0,o.cw),_h,6,6,_h+random(o.ch*0.1,o.ch*0.2));
		},1000);
	}

	o.draw=function(e){
		o.gameCanvas.draw(e);
	};
	return o;
};

