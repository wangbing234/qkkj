/***************************************************
 * 时间: 2016/7/21 15:50
 * 作者: bing.wang
 * 说明: 公用资源权限数据转换类
 *
 ***************************************************/
/**
 * 权限的状态变为可以识别的json
 * @param val
 * @returns
 */
function stateToJson(jsonItem,rsources) {
  var policyItems={};
  var rsources=getResources(jsonItem,rsources);
  let usersArray=[];
  if(jsonItem.users)
  {
    jsonItem.users.map((item,index)=> {
        let itemId=item.id;
         if(itemId && itemId==item.userName)
         {
           itemId=0;
         }
          usersArray.push({userId:itemId,userName: item.userName})
        }
    );
    policyItems.users=usersArray;
    delete jsonItem.users;
  }
  let rolesArray=[];
  if(jsonItem.roles)
  {
    jsonItem.roles.map((item,index)=>{
      rolesArray.push({roleId:item.id,roleName:item.roleName});
    });
    policyItems.roles=rolesArray;
    delete jsonItem.roles;
  }
  if(jsonItem.accesses)
  {
    policyItems.accesses=jsonItem.accesses;
    delete jsonItem.accesses;
  }
  var  tenants= {tenants:[{
    "tenantId": window._currentUser.tenantId,
    "tenantName": window._currentUser.tenantName
  }]};

  var resultData={...jsonItem,...tenants,policyItems:[policyItems],resources:rsources}
  return resultData;
}


/**
 * 获取资源
 * @param jsonItem
 * @param array
 * @returns {{}}
 */
function getResources(jsonItem,array)
  {
    var rsources={};
    array.map((item,index)=>{
      var subResources={};
      let jValue=jsonItem[item];
      subResources[item]={};
      subResources[item].values=(item=="database"?[jValue]:jValue);
      rsources=$.extend(rsources,subResources);
      delete jsonItem[item];
    })
    return rsources;
  }



/**
 * json转换为当前可以显示的状态
 * @param val
 * @returns
 */
function jsonTOState(jsonItem) {

    var policyitems;
    if(jsonItem.policyItems && (policyitems=jsonItem.policyItems[0]))
    {
      if(policyitems.accesses && policyitems.accesses)
      {
        jsonItem.accesses= policyitems.accesses;
      }
      if(policyitems.roles)
      {
        policyitems.roles.map((item,index)=>{item.id=item.roleId});
        jsonItem.roles=policyitems.roles;
      }
      if(policyitems.users)
      {
        policyitems.users.map((item,index)=>{item.id=item.userId});
        jsonItem.users=policyitems.users;
      }
      delete jsonItem.policyitems;
    }

    var resources=jsonItem.resources;
    if(resources)
    {
        for(var key in resources)
        {
          jsonItem[key]=(key=="database"?resources[key].values[0]:resources[key].values);
        }
      //delete jsonItem.resources;
    }
      return jsonItem;
}



export default {
  stateToJson,
  jsonTOState
}
