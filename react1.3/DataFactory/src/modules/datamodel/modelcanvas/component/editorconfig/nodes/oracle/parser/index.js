import CommonParser from '../../../nodes/common/CommonParser'
class Parser extends CommonParser {
  canParser(model) {
    return model.type=="mysql"||model.type=="oracle";
  }
}
module.exports = Parser;