module.exports = {
   //邮箱的验证
    EMAIL_STRING:{name:/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,tip:"请输入正确的邮件格式！"},
    //手机的格式验证
    PHONE_STRING:{name:/^1\d{10}$/,tip:"请输入正确的手机号码！"}
}
