module.exports = {
	path: "configmanage",

	//子路由
	getChildRoutes(location, callbackFunc){
		 require.ensure([],function (require){
			 callbackFunc(null, [require("./projectconfig")]);
		 })
	}
}
