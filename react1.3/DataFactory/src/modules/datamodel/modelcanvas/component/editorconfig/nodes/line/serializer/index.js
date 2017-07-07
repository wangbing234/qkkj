import CommonSerializer from '../../../nodes/common/CommonSerializer'
class Serializer extends CommonSerializer {
  serializer(model) {
    let label = model.labels[0] && model.labels[0].attrs.text.text;
    let keyId=model.data?model.data.keyId:0;
    return {type:"line",sourceRef:`${model.source.id}`,keyId:keyId,targetRef:`${model.target.id}`,id:`${model.id}`,code:`${model.id}`};
  }
}
module.exports = Serializer;