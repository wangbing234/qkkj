const status = {
  //Already passed
  ALREADY_PASSED: 2,//已通过
  NOT_PASSED: 3,//未通过
  NO_APPROVAL: 1,//未审批
  REVOKED: 4,
  ALL:0
};
//state=0  全部  2是一通过  3是未通过 1未批复
const statusArr = [
  { id: status.ALL, name: '全部状态' },
  { id: status.ALREADY_PASSED, name: '已通过' },
  { id: status.NOT_PASSED, name: '未通过' },
  { id: status.NO_APPROVAL, name: '未审批' },
  { id: status.REVOKED, name: '被收回' } ];

const stateDic = {
  [status.ALL]: '全部状态',
  [status.NO_APPROVAL]: '未审批',
  [status.ALREADY_PASSED]: '已通过',
  [status.NOT_PASSED]: '未通过',
  [status.REVOKED]: '被收回'
}

export default {
  status,stateDic,statusArr
}