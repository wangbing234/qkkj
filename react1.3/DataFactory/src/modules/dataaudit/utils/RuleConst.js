const RULE_TYPE_RECORD = 101;
const RULE_TYPE_NULL = 102;
const RULE_TYPE_SOLE = 103;
const RULE_TYPE_DATAFORMATE = 104;
const RULE_TYPE_ACCURATE = 105;
const RULE_TYPE_LOGIC = 106;
const RULE_TYPE_ROLLING = 107;
const RULE_TYPE_CONFORMITY = 201;
const RULE_TYPE_LOGICMULTI = 202;

const typeDic = {
  [RULE_TYPE_RECORD]: "记录数检核（单表）",
  [RULE_TYPE_NULL]: "空值检核（单表）",
  [RULE_TYPE_SOLE]: "唯一性检核（单表）",
  [RULE_TYPE_DATAFORMATE]: "数据格式检核（单表）",
  [RULE_TYPE_ACCURATE]: "准确性检核（单表）",
  [RULE_TYPE_LOGIC]: "逻辑性检核（单表）",
  [RULE_TYPE_ROLLING]: "波动性检核（单表）",
  [RULE_TYPE_CONFORMITY]: "一致性检核（count多表）",
  [RULE_TYPE_LOGICMULTI]: "逻辑性检核（多表）"
}

export default {
  typeDic,
  RULE_TYPE_RECORD,
  RULE_TYPE_NULL,
  RULE_TYPE_SOLE,
  RULE_TYPE_DATAFORMATE,
  RULE_TYPE_ACCURATE,
  RULE_TYPE_LOGIC,
  RULE_TYPE_ROLLING,
  RULE_TYPE_CONFORMITY,
  RULE_TYPE_LOGICMULTI
}