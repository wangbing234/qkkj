let Hive = "Hive";
let Hbase = "HBase";
let MySql = "MySQL";
let RDBMS = "rdbms";
let DB2 = "DB2";
let Oracle = "Oracle";
let DATA_TYPE={"1":"Hive","2":"HBase","3":"MySQL","4":"Oracle","5":"DB2"}
let DRAG_FORMAT={MODEL:"model"}
const QUERY_MODEL_BY_TYPE="query_model_by_type"//通过类型查询模型数据
const LOAD_MODEL_BY_CODE="load_model_by_code"//通过编码加载模型
const LOAD_BY_TABLE_CODE_LEVEL="load_by_table_code_level"//加载几级关系
const DELETE_ONDID_ON_TREE="delete_ondid_on_tree"//在树上彻底删除节点
const REFRESH_COMMON_MODEL_TREE="refresh_common_model_tree"//刷新整棵树

export default {
  Hive,
  Hbase,
  MySql,
  DB2,
  Oracle,
  RDBMS,
  DATA_TYPE,
  QUERY_MODEL_BY_TYPE,
  DRAG_FORMAT,
  LOAD_MODEL_BY_CODE,
  LOAD_BY_TABLE_CODE_LEVEL,
  DELETE_ONDID_ON_TREE,
  REFRESH_COMMON_MODEL_TREE
}