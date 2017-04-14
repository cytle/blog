$(function(){
	var n=6;
			var cxts = new Array(n);//所有画板的上下文
			for (var i = 0; i < n; i++) {
				cxts[i]=document.getElementById("myCanvas"+i).getContext("2d");//初始化cxts
			}
			function getCxt(i){
				return (i<0||i>=n)?undefined:cxts[i];
			}
			var width=160;
			var time = 60 ; //蛇的速度 
			var face={now:0,top:1,bottom:3,left:4,right:5,dm:2}
			var cxt=getCxt(0);

			var x = y = 8; 
			var a = 0; //食物坐标 
			var t = 20; //舍身长 
			var map = []; //记录蛇运行路径 
			var size = 8; //蛇身单元大小 
			var direction = 2; // 1 向上 2 向右 0 左 3下 
	
			var intervalD = window.setInterval(set_game_speed, time); // 移动蛇 
			function set_game_speed(){ // 移动蛇 

				changeFace();
				switch(direction){ 
					case 1:y = (y-size);break; 
					case 2:x = (x+size);break; 
					case 3:y = (y+size);break; 
					case 0:x = (x-size);break; 
				} 
				//$(".log").html($(".log").html()+"<br>x:"+x+" y:"+y+" face:"+face.now);
				
				for(var i=0;i<map.length;i++){ 
					if(map[i].face==face.now&& parseInt(map[i].x)==x && parseInt(map[i].y)==y){ 
						alert("你挂了，继续努力吧！失败原因：撞到自己了.....");window.location.reload(); 
					} 
				} 
				if (map.length>t) { //保持舍身长度 
					var cl = map.shift(); //删除数组第一项，并且返回原元素 
					getCxt(cl['face']).clearRect(cl['x'], cl['y'], size, size); 
				}; 
				map.push({'x':x,'y':y,'face':face.now}); //将数据添加到原数组尾部 
				getCxt(face.now).fillStyle = "#006699";//内部填充颜色 
				getCxt(face.now).strokeStyle = "#006699";//边框颜色 
				getCxt(face.now).fillRect(x,y, size, size);//绘制矩形 
				if((a*8)==x && (a*8)==y){ //吃食物 
					rand_frog();t++; 
				} 
			} 


			function changeFace(){
				var ff;
				

				if(x>=width){

					ff=face.now;
					face.now=face.right;
					face.right=face.dm;
					face.dm=face.left;
					face.left=ff;


					x=0;
				}else if(x<=0){

					ff=face.now;
					face.now=face.left;
					face.left=face.dm;
					face.dm=face.right;
					face.right=ff;

					x=width;
				}else if((y>=width)){

					ff=face.now;
					face.now=face.bottom;
					face.bottom=face.dm;
					face.dm=face.top;
					face.top=ff;

					y=0;
				}else if((y<=0)){


					ff=face.now;
					face.now=face.top;
					face.top=face.dm;
					face.dm=face.bottom;
					face.bottom=ff;

					y=width;
				}
			}

			var running=true;

			document.onkeydown = function(e) { //改变蛇方向 
				
				$(".log").html($(".log").html()+"<br>x:"+direction);
				if(e.keyCode==32){
					if(running){
						clearInterval(intervalD);
					}else{
						intervalD = window.setInterval(set_game_speed, time);
					}
					running=!running;
					return;
				}
				var d=e.keyCode - 37;
				if(d<0||d>3||Math.abs(d-direction)==2){
					return;
				}
				direction=e.keyCode - 37;
			} 
			// 随机放置食物 
			function rand_frog(){ 
				a = Math.ceil(Math.random()*50); 
				getCxt(face.now).fillStyle = "#000000";//内部填充颜色 
				getCxt(face.now).strokeStyle = "#000000";//边框颜色 
				getCxt(face.now).fillRect(a*8, a*8, 8, 8);//绘制矩形 
			}
			// 随机放置食物 
			rand_frog();
		})