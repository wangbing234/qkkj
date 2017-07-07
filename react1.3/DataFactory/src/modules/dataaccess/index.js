module.exports = {
	path: "dataaccess",

	//子路由
	getChildRoutes(location, callbackFunc){
		 require.ensure([],function (require){
			 callbackFunc(null, [require("./datainput"),require("./dataoutput")]);
		 })
	}
}
