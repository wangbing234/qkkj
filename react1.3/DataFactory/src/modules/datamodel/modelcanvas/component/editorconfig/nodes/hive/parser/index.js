import CommonParser from '../../../nodes/common/CommonParser'
class Parser extends CommonParser {
  canParser(model) {
    return model.type=="hive";
  }
}
module.exports = Parser;