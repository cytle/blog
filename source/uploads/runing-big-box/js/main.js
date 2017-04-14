"use strict";
/*
飞机子弹速度+方块速度<min(方块高度,方块宽度)
100g+speedMax<10
g=9.8/rFtp
rFtp=900/runTime
↓
g<0.05
0.05>9.8/rFtp
↓
rFtp>196
900/runTime>196
↓
runTime<4.5918
*/
var playerW=10 //大方块宽度
var playerH=25;	//大方块高度
var runTime=16;//每次运行时间
var rFtp=900/runTime;//平均帧数
var g=9.8/rFtp;//重力
var speedMax=70*g;//最大速度

/*window.onload=function(){
	testDrewSixLine();
}*/

var game=new gameConsole();
window.onload=function(){
	game.init().start();
	game.help();
};


