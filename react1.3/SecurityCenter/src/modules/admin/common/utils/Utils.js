import AdminEnum from 'AdminEnum'
//把对象拼接成URL，应用于post改为url
function getStatusStr(status) {
  let str;
  switch(status){
    case AdminEnum.APPROVAL:
      str = '待审批';
      break;
    case AdminEnum.AGREE:
      str = '已同意';
      break;
    case AdminEnum.DISAGREE:
      str = '已拒绝';
      break;
  }
  return str;
}


export default {
  getStatusStr
}