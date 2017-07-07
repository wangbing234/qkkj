/**
 * 检查长度
 * @param val
 * @param minLength 最小长度
 * @param maxLength 最大长度
 * @returns {boolean}
 */
function checkLength(val, minLength, maxLength) {
  if (val.length <= maxLength && val.length >= minLength) {
    return true
  }
  return false
}
/**
 * 验证input
 * @param value
 * @param isRequired 是否需要验证空
 * @param minLength 最小长度
 * @param maxLength 最大长度
 * @param regExp 其他验证的正则表达式
 * @param regExpErrorStr 其他验证的错误提示字符串
 * @returns  errorStr 失败提示信息
 * 使用说明：validateInput({label:"资源名称",isRequired:true,value:"aaaa",maxLength:16})
 */
function validateInput(obj) {
  let errorStr = "";
  if(!obj){
    return ;
  }
  if(obj.isRequired && (obj.value=="undefined" || !obj.value || (obj.value instanceof Array == true && obj.value.length == 0))){
    errorStr = `${obj.label}不能为空！`
  }else if(obj.minLength && obj.maxLength){
    errorStr = checkLength(obj.value,obj.minLength,obj.maxLength)?errorStr:`${obj.label}字符长度必须介于${obj.minLength}~${obj.maxLength}之间！`;
  }else if(obj.minLength && obj.value && obj.value.length < obj.minLength) {
    errorStr = `长度不能小于${obj.minLength}个字符`;
  }else if(obj.maxLength && obj.value && obj.value.length > obj.maxLength) {
    errorStr = `长度不能大于${obj.maxLength}个字符`;
  }else if(obj.regExp && obj.value && !obj.regExp.test(obj.value)) {
    errorStr = obj.regExpErrorStr?obj.regExpErrorStr:`${obj.label}格式错误！`
  }
  return errorStr;
}

function formItemValidate(formItemChild,value){
  let flag;
  let ct = formItemChild.context;
  if(ct.formItem && ct.formItem.validate){
    flag = ct.formItem.validate(value);
  }
  return flag;
}

export default {
  checkLength,
  validateInput,
  formItemValidate
}
