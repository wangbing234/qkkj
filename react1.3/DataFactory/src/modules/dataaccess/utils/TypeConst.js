const DB = 4;
const FTP = 9;

const ISINCREASEIMPORT = 1;//增量

const importType = 1;//导入方式是否是hive,1 是， 2是hdfs

//1单表 2多表 3条件 4ftp 5导出
const SINGLETABLE_TYPE = 1;
const MULTITABLE_TYPE = 2;
const CONDITION_TYPE = 3;
const FTP_TYPE = 4;
const EXPORT_TYPE = 5;

let dataSourceTypeDic = {};

let dataSourceTypeIdDic = {};

const dataAccess_typeDic = {
  [SINGLETABLE_TYPE]:"单表",
  [MULTITABLE_TYPE]:"多表",
  [CONDITION_TYPE]:"条件",
  [FTP_TYPE]:"FTP",
  [EXPORT_TYPE]:"导出"
};

export default {
  DB,FTP,ISINCREASEIMPORT,SINGLETABLE_TYPE,MULTITABLE_TYPE,CONDITION_TYPE,FTP_TYPE,EXPORT_TYPE,importType,
  dataAccess_typeDic,dataSourceTypeDic,dataSourceTypeIdDic
}