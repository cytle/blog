"use strict";
function canvasConsole(CanvasId){
	var cx=document.getElementById(CanvasId);	/*画布对象*/
	var height=document.body.offsetHeight;			/*画布宽度*/
	var width=document.body.offsetWidth;			/*画布高度*/
	var ctx=cx.getContext("2d");				/*画布*/
	cx.width=width;
	cx.height=height;
	ctx.fillStyle = "#006699";
	var drawMap=[];								/*需要画的内容集*/

	this.getWidth=function(){
		return width;
	}
	this.getHeight=function(){
		return height;
	}
	/*往画数组内添加元素*/
	this.draw=function(e){
		drawMap.push(e);
	}
	/**
	* drawC 画图
	*******************************
	* @return void
	*/
	this.drawC=function(){
		ctx.fillStyle = "#006644";
		ctx.fillRect(0,0,width,height);
		var d;
		while(d=drawMap.shift()){
			if (d.style!=-1) {
				ctx.fillStyle = d.style;
				ctx.strokeStyle = d.style;
			}else{
				ctx.fillStyle = "#FFFFFF";
				ctx.strokeStyle = "#FFFFFF"; 
			};
			switch(d.type){
				case 0:ctx.fillRect(d.x,d.y,d.w,d.h);
				break;
				case 1:rectPlane1(d);
				break;
				case 2:rectPlane2(d);
				break;
				case 3:rectSubstances(d);
				break;
				default:;
			}
		}
	}
	/*飞机 A面*/
	function rectPlane1(d){
		ctx.beginPath();
		ctx.moveTo(d.x,d.y); /*设置路径起点，坐标为(20,20)*/
		ctx.lineTo(d.x+0.35*d.w,d.y+0.5*d.h);

		ctx.lineTo(d.x,d.y+d.h);

		ctx.lineTo(d.x+d.w,d.y+0.5*d.h); 
		ctx.lineTo(d.x,d.y); 


		ctx.lineWidth = 1.0; /*设置线宽*/


		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	}
	/*飞机 B面*/
	function rectPlane2(d){
		ctx.beginPath();
		ctx.moveTo(d.x,d.y+0.5*d.h); /*设置路径起点，坐标为(20,20)*/
		ctx.lineTo(d.x+d.w,d.y+d.h);

		ctx.lineTo(d.x+0.65*d.w,d.y+0.5*d.h);

		ctx.lineTo(d.x+d.w,d.y);

		ctx.lineTo(d.x,d.y+0.5*d.h); 


		ctx.lineWidth = 1.0; /*设置线宽*/


		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	};
	function rectSubstances(d){
		ctx.beginPath();
		ctx.moveTo( d.lx, d.ly );
		ctx.lineTo( d.x, d.y );
		ctx.strokeStyle = d.style;
		ctx.stroke();
		
	}

	/*测试方法，画出矩形的外六线*/
	this.drewSixLine=function(ax,ay,bx,by,w,h){

		ctx.fillStyle = "#006644";
		ctx.fillRect(0,0,width,height);

		ctx.fillStyle = "#FF6644";

		ctx.fillRect(ax,ay,4,4);
		ctx.fillRect(bx,by,4,4);

		ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = "#FFFFFF"; 

		var lineR=getSixLine(ax,ay,bx,by,w,h);
		console.log(lineR);

		for (var i = lineR.length - 1; i >= 0; i--) {
			console.log(lineR[i].a.x,lineR[i].a.y,lineR[i].b.x,lineR[i].b.y);

			ctx.moveTo(lineR[i].a.x,lineR[i].a.y); /*设置路径起点，坐标为(20,20)*/
			ctx.lineTo(lineR[i].b.x,lineR[i].b.y);
		};

		ctx.lineWidth = 2.0; /*设置线宽*/
		ctx.stroke();

	}
	return this;
}