/***************************************************
 * 时间: 2016/7/21 15:57
 * 作者: bing.wang
 * 说明: 角色路由
 *
 ***************************************************/
module.exports = {
	path: 'user',

	getComponent(location, callbackFunc){
		require.ensure([], (require) => {
			callbackFunc(null, require("./component/UserManage"));
		});
	}
}