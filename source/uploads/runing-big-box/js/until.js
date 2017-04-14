"use strict";

function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}





/**
* is_boom 检查两个对象是否碰撞
*******************************
* @param obj m 被撞对象
* @param obj n 子弹对象
*******************************
* @return boolean 是否碰撞
**/
/* 
* TODO 依照轨迹再判断
*/ 
function is_boom(n,m){
	var zdLine=getObjLine(n);
	for (var i = m.sixLine.length - 1; i >= 0; i--) {
		if(intersectLineSegments(zdLine,m.sixLine[i]))
			return true;
	};
	return false;
}
function getObjLine(obj){
	return getLine(obj.lx,obj.ly,obj.x,obj.y);
}
function getLine(ax,ay,bx,by){
	return {a:getPoint(ax,ay),b:getPoint(bx,by)};
}
function getPoint(x,y){
	return {x:x,y:y};
}
/**
	m:ax>bx?1:0
	n:ay>by?1:0
	排除	条件 		另一个矩形		编号	
	Aa 		mn			Db				0,3  
	Ba		(1-m)n 		Cb				1,2  
	Ca 		m(1-n)		Bb 				2,1  
	Da 		(1-m)(1-n) 	Ab 				3,0  
	*/
	function getSixLine(ax,ay,bx,by,w,h){
		var m=ax>bx?1:2;
		var n=ay>by?-1:1;
		
		var pR=[m+n,3-m-n];
		var pointR=[
		[
		getPoint(ax,ay),		getPoint(ax+w,ay),
		getPoint(ax,ay+h),		getPoint(ax+w,ay+h),
		],	/*a矩形四点*/
		[
		getPoint(bx,by), 		getPoint(bx+w,by),
		getPoint(bx,by+h),		getPoint(bx+w,by+h),
		]	/*b矩形四点*/
		
		]
		var LineArr=[];
		for (var i = 0; i <2; i++) {
			for (var j = 0; j < 4; j++) {
				if(pR.indexOf(j)==-1){
					LineArr.push({a:pointR[i][pR[1-i]],b:pointR[i][j]});	//矩形需要探测的边
					if(i==0)	
						LineArr.push({a:pointR[0][j],b:pointR[1][j]});		//两矩形间需要探测的连线
				}
			};
		};
		return LineArr;
	}

	/* == Helper == */
// 用于帮助检测 碰撞
/**
 * Helper area calculation function. Returns 2 X the area.
 * 三角形外积
 *
 * @param  {Vec2} pointA
 * @param  {Vec2} pointB
 * @param  {Vec2} pointC
 * @return {number}
 */
 function signed2DTriArea(pointA, pointB, pointC) {
 	return ((pointA.x - pointC.x) * (pointB.y - pointC.y) - (pointA.y - pointC.y) * (pointB.x - pointC.x));
 }

/**
 * Helper intersection function. Checks if two lines intersect.
 *
 * @param {LineSegment2} a Line A
 * @param {LineSegment2} b Line B
 * @return {Object} An object is returned with intersection point and time if they intersect, otherwise null.
 * 判断两条线段是否相交，如果是，返回交点，和相交比例， 否则返回null
 */
 function intersectLineSegments(a, b) {
 	var a1 = signed2DTriArea(a.a, a.b, b.b);
 	var a2 = signed2DTriArea(a.a, a.b, b.a);
 	if (a1 * a2 < 0) {
 		var a3 = signed2DTriArea(b.a, b.b, a.a);
 		var a4 = a3 + a2 - a1;
 		if (a3 * a4 < 0) {
 			return true;
 		}
 	}

 	return false;
 }





