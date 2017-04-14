

var running3d;
var a=0;
var ss=1;
$(".box li").click(function(){
	$(this).data('id');

	rotate(1,0,0,360);
});
var nowzb={x:1,y:2,z:3},azb=[0,0,0];
function rotateOne(xyz,angle){
	if(running3d)
		return;
	running3d=true;
	var box=$('.box')[0];
	var fs=(angle<0)?-1:1;

	var i = Math.ceil(fs*angle/5);
	var t=angle/i;

	var d=1;
	if(xyz=="X"){

		log("X<br>");
		if(nowzb.x<0){
			t=-t;
			d=-nowzb.x;
		}else{
			d=nowzb.x;
		}

	}else{
		log("X<br>");
		if(nowzb.y<0){
			t=-t;
			d=-nowzb.y;
		}else{
			d=nowzb.y;
		}
	}
	//旋转坐标
	if(xyz=="X"&&fs>0){
		//向上旋转

		log("上");
		aa=nowzb.z;
		nowzb.z=nowzb.y;
		nowzb.y=-aa;
	}else if(xyz=="X"&&fs<0){
		//向下旋转

		log("下");
		aa=nowzb.z;
		nowzb.z=-nowzb.y;
		nowzb.y=aa;
	}else if(xyz=="Y"&&fs>0){
		//向左旋转

		log("左");
		aa=nowzb.z;
		nowzb.z=-nowzb.x;
		nowzb.x=aa;
	}else if(xyz=="Y"&&fs<0){
		//向右旋转
		log("右");
		aa=nowzb.z;
		nowzb.z=nowzb.x;
		nowzb.x=-aa;
	}
	log("<br>"+nowzb.x+nowzb.y+nowzb.z+d);

	var interval=setInterval(function(){

		if(i<=0){
			clearInterval(interval);
			log("<br>"+box.style.transform);
			var aa;
			
			running3d=false;
			return;
		}
		i--;

		azb[d-1]+=t;

		setCss3(box,{transform:"rotateX("+azb[0]+"deg) rotateY("+azb[1]+"deg) rotateZ("+azb[2]+"deg)"})
	},30)
}
function setCss3(obj,attrObj) {

	for (var i in attrObj) {
		var newi=i;
		if(newi.indexOf("-")>0){
			var num=newi.indexOf("-");
			newi=newi.replace(newi.substr(num,2),newi.substr(num+1,1).toUpperCase());
		}
		obj.style[newi]=attrObj[i];
		newi=newi.replace(newi.charAt(0),newi.charAt(0).toUpperCase());
		obj.style["webkit"+newi]=attrObj[i];
		obj.style["moz"+newi]=attrObj[i];
		obj.style["o"+newi]=attrObj[i];
		obj.style["ms"+newi]=attrObj[i];
	}
}
function log(str){
	$(".log").html(str+$(".log").html());
}
/*

function rotate(x,y,z,angle){

	var box=$('.box')[0];
	var fs=false;
	if(angle<0){
		fs=true;
		angle=-angle;
	}
	var i = Math.ceil(angle/5);
	var t=angle/i;
	ax+=x;ay+=y;az+=z;

	var interval=setInterval(function(){

		if(i<=1){
			running3d=false;

			$(".log").html($(".log").html()+"<br>"+a);
			clearInterval(interval);
		}
		i--;
		running3d=true;
		a+=fs?-t:t;
		setCss3(box,{transform:"rotate3d("+x+","+y+","+z+","+a+"deg)"})
	},30)
}
*/