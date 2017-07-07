/**
 * 权限的状态变为可以识别的json
 * @param val
 * @returns
 */
function stateToJson(jsonItem, rsources,roles=[]) {
  var policyItems = {};
  var rsources = getResources(jsonItem, rsources);
  if (jsonItem.users) {
    jsonItem.users.map((item, index)=> {
      item.userId = item.id, delete item.id
    });
    policyItems.users = jsonItem.users;
    delete jsonItem.users;
  }
  if (roles.length > 0) {
    /*jsonItem.roles.map((item, index)=> {
      item.roleId = item.id, delete item.id
    });*/
    policyItems.roles = roles;
    delete jsonItem.roles;
  } else if(jsonItem.roles){
    policyItems.roles = jsonItem.roles;
    delete jsonItem.roles;
  }
  if (jsonItem.accesses) {
    policyItems.accesses = jsonItem.accesses;
    delete jsonItem.accesses;
  }

  if (jsonItem.tenantId) {
    let tenants=[];
    jsonItem.tenantId.map((item, index)=> {
      tenants.push({tenantId:item,tenantName:''});
    });
    jsonItem.tenants = tenants;
    delete jsonItem.tenantId;
    /*jsonItem.tenants.map((item, index)=> {
     item.tenantId = item;
     item.tenantName = '';
     });*/
    //jsonItem.tenants = policyitems.users;
  }
  /*var tenants = {
    tenants: [{
      "tenantId": 12,
      "tenantName": "租户1"
    }]
  };*/

  var resultData = {...jsonItem, policyItems: [policyItems], resources: rsources}
  return resultData;
}


function getResources(jsonItem, array) {
  var rsources = {};
  array.map((item, index)=> {
    var subResources = {};
    let jValue = jsonItem[item];
    subResources[item] = {};
    subResources[item].values = jValue?jValue:['*'];//[jValue]
    rsources = $.extend(rsources, subResources);
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
  if (jsonItem.policyItems && (policyitems = jsonItem.policyItems[0])) {
    if (policyitems.accesses && policyitems.accesses) {
      jsonItem.accesses = policyitems.accesses;
    }
    if (policyitems.roles) {
      policyitems.roles.map((item, index)=> {
        item.id = item.roleId
      });
      jsonItem.roles = policyitems.roles;
    }
    if (policyitems.users) {
      policyitems.users.map((item, index)=> {
        item.id = item.userId
      });
      jsonItem.users = policyitems.users;
    }

    delete jsonItem.policyitems;
  }

  var resources = jsonItem.resources;
  if (resources) {
    for (var key in resources) {
      jsonItem[key] = resources[key].values;
    }
    delete jsonItem.resources;
  }

  var tenants = jsonItem.tenants;
  if (tenants) {
    let tenantNamesArr = [];
    let tenantIdArr = [];
    tenants.map((item, index)=> {
      tenantNamesArr.push(item.tenantName);
      tenantIdArr.push(item.tenantId);
    });
    jsonItem['tenantName'] = tenantNamesArr;
    jsonItem['tenantId'] = tenantIdArr;
  }

  return jsonItem;
}


export default {
  stateToJson,
  jsonTOState
}
