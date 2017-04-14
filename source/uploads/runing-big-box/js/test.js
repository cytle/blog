"use strict";
/**
* testKeyDown 测试用户持续按某键按键 
*******************************
* @param int keyCode 3右 2上 1左
*******************************
* @return void
**/
function testKeyDown (keyCode) {
	
	window.setInterval(function(){aPlayer.setKeyDown(keyCode)},1);
}

/**
* testStart 不停执行开始游戏 
*******************************
* 
*******************************
* @return void
**/
function testStart() {
	window.setInterval(function(){gameStart();},1000);
}

function testDrewSixLine(){
	
	var gameCanvas=new canvasConsole("myCanvas"); 
	gameCanvas.drewSixLine(55,23,123,23,10,25);
	
}
