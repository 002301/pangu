/*	简单的 图片资源加载器
 *	@param {String | Array | JSON } property | arg0 
 *		String : 准备加载的图片
 *		Array  : 准备加载的图片资源队列
 * 		JSON   ：准备加载的图片或图片资源队列、加载完成后回调、加载进度回调。格式为：
 *			{
 *				"assets"	: 准备加载的图片或图片资源队列 {String | Array}
 *				"completed"	: 加载完成后回调 {function}
 *				"progress"	: 加载进度回调 {function}
 *			}
 *			注：如果第一个参数为JSON 格式，则会忽略后面的所有参数
 *
 *	@param {Function | JSON } options | arg1
 *		Function : 加载完成后回调
 *			@param	{Integer}	arg0	加载资源总数
 *			@param	{Integer}	arg1	加载成功数量
 *			@param	{Integer}	arg2	加载失败数量
 *		JSON 	 : 加载完成后回调、加载进度回调。格式为：
 *			{
 *				"completed"	: 加载完成后回调 {function}
 *				"progress"	: 加载进度回调 {function}
 *			}	
 *			注：如果第二个参数为JSON 格式，则会忽略后面的所有参数
 *	
 *	@param {Function} arg2
 *		Function : 加载进度回调
 *			@param	{Integer}	arg0	加载资源总数
 *			@param	{Integer}	arg1	当前加载成功数量
 *			@param	{Integer}	arg2	当前加载失败数量
 *
 *	Public Function
 *		func load : {Main Function}	执行加载
 *			@param	参数列表同以上。
 *	
 *	Public Property
 *		assets	{Object}	加载资源列表(含加载状态。不论是否加载成功)
 *		asset 	{Object}	加载成功 资源列表
 *
 */
function ImgLoader(property,options){
	var onloadedcompleted	,// 加载完成回调
		onloading			,// 加载进度回调
		NUM_ELEMENTS		,// 资源总数
		NUM_LOADED = 0		,// 已加载数量
		NUM_ERROR = 0		,// 加载错误数量
		TempProperty = {}	,// 资源列表
		LOADED_THEMES={}	,// 加载成功的资源
		loadList = [] 		;// 加载队列

	this.assets=TempProperty;//对象引用
	this.asset=LOADED_THEMES;
	this.load=function(prop,opt){
		//初始化参数
		if(typeof(prop) == 'string'){
			loadList[0]=prop;
		}else if(Object.prototype.toString.apply(prop)=='[object Array]'){
			//property 为数组 对象 则考虑其他参数
			loadList=prop;

			//回调函数
			if(typeof(opt) == 'function'){
				onloadedcompleted	=	opt;
				onloading			=	typeof(arguments[2])=='function'? arguments[2] : null;
			}else if(typeof(opt) == 'object'){
				onloadedcompleted	=	opt['completed'];
				onloading			=	opt['progress'] ;
			}
		}else if(typeof(prop) == 'object'){
			//property 为json 对象 则不考虑其他参数
			loadList			=	prop['assets']		;
			onloadedcompleted	=	prop['completed']	;
			onloading			=	prop['progress']	;
		}
		//资源总数
		NUM_ELEMENTS=loadList.length;
		NUM_LOADED = 0;
		NUM_ERROR = 0;
		TempProperty = {};// 资源列表
		LOADED_THEMES={};

		imageLoad(loadList);
	};

	function imageLoad(array){
		var count=array.length;
		for(var i=0;i<count;i++){
			loadImg(array[i],imageLoaded,imageLoadError);
		}
	}
	function loadImg(img,loaded,error){
		var image=new Image();
		image.onload=loaded;
		image.onerror=error;
		image.src=img;
		//存储资源引用
		TempProperty[img]=image;
	};
	function imageLoaded(){
		var imgsrc=this.getAttribute("src");
		TempProperty[imgsrc].loaded=true;
		NUM_LOADED++;
		if(NUM_LOADED+NUM_ERROR==NUM_ELEMENTS){
			//加载完毕 则调用completed
			typeof(onloadedcompleted) =='function' && onloadedcompleted(NUM_ELEMENTS,NUM_LOADED,NUM_ERROR);
		}else{
			//加载进行中...调用 onloading
			typeof(onloading) =='function' && onloading(NUM_ELEMENTS,NUM_LOADED,NUM_ERROR);
		}
	};
	function imageLoadError(){
		var imgsrc=this.getAttribute("src");
		TempProperty[imgsrc].loaded=false;
		NUM_ERROR++;
		//加载错误后需要继续处理...
		if(NUM_LOADED+NUM_ERROR==NUM_ELEMENTS){
			//加载完毕 则调用completed
			typeof(onloadedcompleted) =='function' && onloadedcompleted(NUM_ELEMENTS,NUM_LOADED,NUM_ERROR);
		}else{
			//加载进行中...调用 onloading
			typeof(onloading) =='function' && onloading(NUM_ELEMENTS,NUM_LOADED,NUM_ERROR);
		}
	};
	
	this.load.apply(this,arguments);
};

/*	使用方式介绍
 *	1.设置资源列表：
 *		var assets=[...]; //预加载图片列表数组
 *
 *	2.预定义加载进度回调和 加载完成时的回调
 *		function progress(a,b,c){  //加载进度回调
 *			var per=(100*(b+c)/a)+"%"; //计算当前百分比
 *		}
 *		function completed(a,b,c){
 *			alert("completed");
 *		}
 *		注：回调function可以在传递的时候直接定义为匿名函数。例如：
 *			var loader1=new ImgLoader(assets,function(a,b,c){...},function(a,b,c){...});
 *
 *	3.实现对象并开始执行加载
 *		var loader1=new ImgLoader(assets,completed,progress);
 *	  可以多种实现方式
 *		方式 1 :
 *			var loader1=new ImgLoader(assets,completed,progress);
 *					
 *		方式 2 ：
 *			var loader2=new ImgLoader(assets,{
 *				"completed":completed,
 *				"progress":progress
 *			});
 *
 *		方式 3 ：
 *			var loader3=new ImgLoader({
 *				"assets":assets,
 *				"completed":completed,
 *				"progress":progress
 *			});
 *
 *		方式 4 ：
 *			var loader4=new ImgLoader();
 *			loader4.load(assets,{
 *				"completed":completed,
 *				"progress":progress
 *			});
 *			注：此处的参数传递方式可以按照上面3种的任意一种形式
 */