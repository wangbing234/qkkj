/***************************************************
 * 时间: 2016/8/18 14:08
 * 作者: bing.wang
 * 说明: 表单验证的控制
 *
 ***************************************************/

/**
 *
 * @param owner  tab所有者
 * @param array  验证的数组
 * @param isAdd  是否是添加
 */
function validateTab(owner, array,isAdd,isDLL) {
    if(isAdd)//增加
    {
      for (let i=0; i < array.length; i++) {
        let vObj=array[i];
        if(!vObj.tab || !vObj.tab.vaildate())//一定要渲染，并且通过
        {
            if(!isDLL) {
                owner.setState({activeIndex: i});
            }
          return false;
        }
      }
    }//编辑
    else{
      for (let i=0; i < array.length; i++) {
        let vObj=array[i];
          if(vObj.tab && !vObj.tab.vaildate())//要么没有渲染，要么不通过就是pass
          {
              if(!isDLL) {
                  owner.setState({activeIndex: i});
              }
            return false;
          }
      }
    }
  return true;
}
export default {
  validateTab
}