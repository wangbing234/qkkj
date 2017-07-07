module.exports = {
  //数字
  NUM: /^[0-9]+$/,

  //正整数
  NUM_Z: /^[1-9]\d*$/,

  //正整数  大小32个字符
  NUM_Z_32: /^[1-9]{0,32}$/,

  //数字，包括小数
  NUM_POINT: /^[0-9.]+$/,

  //小时
  NUM_HOUR: /^([01]?\d|2[0-3])$/,

  //分钟
  NUM_MINI: /^([0-5]?\d)$/,

  //首个数字不能为0的数字
  NOTZERONUM: /^[1-9]\d*$/,

  //数字 字母
  NUM_STRING: /^[a-zA-Z0-9]+$/i,

  //字母 下划线， 大小10个字符
  STRING_UNDERLINE_10: /^[a-zA-Z/_]{0,10}$/i,

  //数字 字母 下划线
  NUM_STRING_UNDERLINE: /^[a-zA-Z0-9_]+$/i,

  //数字 字母 下划线， 大小10个字符
  NUM_STRING_UNDERLINE_10: /^[a-zA-Z0-9_]{0,10}$/i,

  //数字 字母 下划线， 大小16个字符
  NUM_STRING_UNDERLINE_16: /^[a-zA-Z0-9_]{0,16}$/i,

  //数字 字母 下划线， 大小24个字符
  NUM_STRING_UNDERLINE_24: /^[a-zA-Z0-9\_]{0,24}$/i,

  //数字 字母 中文汉字 下划线
  NUM_STRING_CHARS_UNDERLINE: /^[0-9a-zA-Z\u4E00-\u9FA5\_]+$/i,

  //数字 字母 中文汉字 下划线  大小16个字符
  NUM_STRING_CHARS_UNDERLINE_16: /^[0-9a-zA-Z\u4E00-\u9FA5\_]{0,16}$/i,

  //数字 字母 中文汉字 下划线  大小24个字符
  NUM_STRING_CHARS_UNDERLINE_24: /^[0-9a-zA-Z\u4E00-\u9FA5\_]{0,24}$/i,

  //数字 字母 中文汉字 下划线  大小32个字符
  NUM_STRING_CHARS_UNDERLINE_32: /^[0-9a-zA-Z\u4E00-\u9FA5\_]{0,32}$/i,

  //数字 字母 中文汉字 下划线 大小64个字符
  NUM_STRING_CHARS_UNDERLINE_64: /^[0-9a-zA-Z\u4E00-\u9FA5\_]{0,64}$/i,

  //数字 字母 汉字 下划线， 大小150个字符
  NUM_STRING_CHARS_UNDERLINE_150: /^[0-9a-zA-Z\u4E00-\u9FA5\_]{0,150}$/i,

  //数字 字母 中文汉字 下划线 .   大小16个字符
  NUM_STRING_CHARS_UNDERLINE_POINT_16: /^[0-9a-zA-Z\u4E00-\u9FA5\_\.]{0,16}$/i,

  //数字 字母 下划线 .   大小24个字符
  NUM_STRING_UNDERLINE_POINT_24: /^[0-9a-zA-Z\_\.]{0,24}$/i,

  //数字 字母 下划线 .   大小64个字符
  NUM_STRING_UNDERLINE_POINT_255: /^[0-9a-zA-Z\_\.]{0,255}$/i,

  //数字 字母 下划线 点 ‘-’
  NUM_STRING_POINT_UNDERLINE: /^[0-9a-zA-Z\.\-\_]+$/i,

  //只能输入字母、数字、下划线、点和@，且必须以字母开头，长度为4-16个字符,不能写｛4，0｝
  NUM_STRING_UNDERLINE_AT_POINT: /^[a-zA-Z][a-zA-Z0-9_.@]{0,16}$/i,

  //只能输入字母、数字、下划线，且必须以字母开头；
  NUM_START_STRING_UNDERLINE: /^[a-zA-Z][a-zA-Z0-9\_]*$/i,

  //只能输入字母、数字、下划线，且必须以字母开头；长度不超过16个字符
  NUM_START_STRING_UNDERLINE_16: /^[a-zA-Z][a-zA-Z0-9\_]{0,16}$/i,

  //只能输入字母、数字、下划线，且必须以字母开头；长度不超过32个字符
  NUM_START_STRING_UNDERLINE_32: /^[a-zA-Z][a-zA-Z0-9\_]{0,32}$/i,
  //只能输入字母、数字、下划线，且必须以字母开头；长度不超过64个字符
  NUM_START_STRING_UNDERLINE_64: /^[a-zA-Z][a-zA-Z0-9\_]{0,64}$/i,

  //只能输入字母、数字、点、下划线，且必须以字母开头；长度不超过64个字符
  NUM_START_STRING_UNDERLINE_POINT_64: /^[a-zA-Z0-9\_\.]{0,64}$/i,

  NUM_START_STRING_UNDERLINE_POINT_512: /^[a-zA-Z0-9\_\.]{0,512}$/i,

  //数字、字母、下划线、逗号、-$,{},/，长度小于255个字符
  NUM_START_STRING_UNDERLINE_SPECIALCHAR_255: /^[a-zA-Z0-9\,\_\-\$\{\}\/]{0,255}$/i,

  //数字、字母、下划线、逗号、-.$,{},/，长度小于255个字符
  NUM_START_STRING_UNDERLINE_POINT_SPECIALCHAR_255: /^[a-zA-Z0-9\,\_\.\-\$\{\}\/]{0,255}$/i,

  //数字、字母、下划线,空格、-.$,{},/ 长度小于255个字符
  NUM_START_STRING_UNDERLINE_POIN_SPACE_T_SPECIALCHAR_255: /^[a-zA-Z0-9\s\,\_\.\-\$\{\}\/]{0,255}$/i,

  //数字、字母、下划线,空格、-.$,{},/ 长度小于1024个字符
  NUM_START_STRING_UNDERLINE_POIN_SPACE_T_SPECIALCHAR_1024: /^[a-zA-Z0-9\s\,\_\.\-\$\{\}\/]{0,1024}$/i,

  //数字,字母  ,  =
  NUM_START_STRING_UNDERLINE_PARAM_255: /^[a-zA-Z0-9\,\=]{0,255}$/i,

  //数字 字母 下划线 ‘*’
  NUM_STRING_UNDERLINE_STAR: /^[a-zA-Z0-9\_\*]{0,10}$/i,

  //非汉字,长度0-255
  NOT_CHARS_255: /^[^\u4e00-\u9fa5]{0,255}$/i,

  //非汉字
  NOT_CHARS: /^[^\u4E00-\u9FA5]+$/,

  //非汉字, 字符长度：128以内
  NOT_CHARS_128: /^[^\u4E00-\u9FA5]{0,128}$/,

  //非中文字符,切首字符必须是a-z/A-Z的字符
  NOT_CHARS_64: /^[a-z][^\u4E00-\u9FA5]*$/i,

  //端口号 数字限制
  NUM_PORT: /^[1-9][0-9]{0,4}$/,
  //密码 必须包含大小写字母、数字、特殊字符中的两种
  //PWD:/^([a-z]+)^([A-Z]+)^([0-9]+)^([@#$%^&*]{2,})$/
  //PWD: /^([a-z]+)([A-Z]+)([0-9]+)([@#$%^&*]{2,})$/,

  //密码:至少包含一个数字,一个特殊字符
  PWD1: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,

  //密码:至少包含大小写字母, 数字, 特殊字符 中的两个
  PWD: /^((?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$)|((?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$)|((?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$)|((?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$)$/,

  //手机号
  PHONE: /^1[0-9]{10}$/,

  //邮箱
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  FILE_PATH: /^[\/]/
}
