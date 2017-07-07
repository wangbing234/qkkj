import update from 'react-update'
import get from 'lodash/get'
/*
  功能：获取选中的tree的节点数组
*  objTree 树对象
*  onlyLeaf 0：只需要子节点，1：包含所有勾选节点，2：只有父节点
*  arrayIds空数组，用来接受选择的ID
    ***************************************************************************/
function getCheckTreeArray(objTree, onlyLeaf,arrayIds) {

  if(objTree instanceof Array)
  {
    for (var toItem of objTree)
      getCheckTreeArray(toItem,onlyLeaf,arrayIds);
  }
  else {
       if(onlyLeaf==0)
       {
           if(objTree["checked"] && (!objTree.children || objTree.children.length==0) )
           {
             arrayIds.push(objTree)
           }
           if(objTree.children)
             getCheckTreeArray(objTree.children,onlyLeaf,arrayIds);
        }
       else if(onlyLeaf==1)
       {
           if(objTree["checked"])
               arrayIds.push(objTree)
           if(objTree.children)
             getCheckTreeArray(objTree.children,onlyLeaf,arrayIds);
       }
       else if(onlyLeaf==2)
       {
         if(objTree["checked"])
         {
           arrayIds.push(objTree)
         }
         else{
           if(objTree.children)
             getCheckTreeArray(objTree.children,onlyLeaf,arrayIds);
         }
       }


  }
}

/**
 * 删除没用选择的的数组
 * @param cloneData
 * @param parent
 * @returns {*}
 * private
 */
function deleteNotEnableObject(cloneData)
{
    cloneData.children=cloneData.children.filter(item =>(item.isEnable==1 && item.checked))
    for (let obj of cloneData.children) {
        deleteNotEnableObject(obj);
    }
}



/**
 * 获取权限数据
 * @param data
 */
function getSelectTableData(data,pathObject){
    let cloneData = $.extend(true,[],data);
    let auth2LeafNode=[];
    getLeafNode(cloneData,auth2LeafNode);
    let objC={};
    if(auth2LeafNode && auth2LeafNode.length>0)
    {
        updataParentEnable(cloneData,auth2LeafNode,pathObject);
        objC={children:cloneData};
        deleteNotEnableObject(objC);
    }
    return objC.children||[];
}


/**
 * 获取未授权的叶子节点
 * @param cloneData
 * @param auth2LeafNode
 * @returns {*}
 * private
 */
function getLeafNode(cloneData,auth2LeafNode)
{
    for (let _obj of cloneData){
        if(_obj.checked && (!_obj.children || _obj.children.length==0) && _obj.authStatus==2)
        {
            auth2LeafNode.push(_obj);
        }

        if(_obj.children)
            getLeafNode(_obj.children,auth2LeafNode);
    }
}

/**
 * 获取未授权的叶子节点
 * @param cloneData
 * @param auth2LeafNode
 * @returns {*}
 * private
 */
function updataParentEnable(cloneData,auth2LeafNode,pathObject)
{
    for (let _authObject of auth2LeafNode){
        let path=pathObject[_authObject.id];
        let dataPath=['data', ...path.slice(0, -2)];
        _authObject.isEnable=1;
        updateParent(cloneData,dataPath);
    }
}


/**
 * 更新父类
 * @param item
 * @returns {*}
 */
function  updateParent(_data, path) {
        if (path.length <= 1) return
        let parent = get(_data, path.slice(1));
            _data.isEnable=1;
        parent.isEnable=1;
        updateParent(_data, path.slice(0, -2))
    }

/**
 * 获取当前item是否可以编辑
 * @param item
 * @returns {*}
 */
function getItemDisabled(item)
{
    for (let obj of item.children) {
        if((!obj.children || obj.children.length==0) && obj.authStatus!=2)
        {
            return true;
            break;
        }
        return getItemDisabled(obj);
    }
    return false;
}


export default {
    getCheckTreeArray,
    getSelectTableData,
    getItemDisabled
}