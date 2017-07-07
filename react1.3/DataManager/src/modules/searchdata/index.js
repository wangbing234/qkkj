module.exports = {
    path:'searchData',
    getChildRoutes(location,callbackFunc){
        console.log('searchData');
        require.ensure([],function(require){
            callbackFunc(null,[require('./searchtable'),require('./searchscript'),require('./searchworkflow')]);
        });
    }
};