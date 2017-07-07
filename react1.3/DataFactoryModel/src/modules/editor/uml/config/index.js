export default {
  "group": [
    {
      "id": "normal",
      "name": "normal",
      "label": "基本节点"
    },
    {
      "id": "demo",
      "name": "demo",
      "label": "逻辑节点"
    }
  ],
  "line": {
    "name": "line",
    "label": "线段",
    "toolTip": "线段",
    "window": require('../nodes/line/win'),
    "parser": require('../nodes/line/parser'),
    "serializer": require('../nodes/line/serializer'),
  },
  n: {},
  "node": [
    {
      "id": "1",
      "name": "StartEvent",
      "label": "开始",
      "toolTip": "开始",
      "window": require('../nodes/start/win'),
      "parser": require('../nodes/start/parser'),
      "serializer": require('../nodes/start/serializer'),
      "rGroup": "demo",
      "tImage": "src/common/imgs/editor/Start.png",
      "image": "src/common/imgs/editor/Start.png",
      "inLimit": "0",
      "outLimit": "-1"
    },
    {
      "id": "2",
      "name": "EndEvent",
      "label": "结束",
      "toolTip": "结束",
      "window": require('../nodes/end/win'),
      "parser": require('../nodes/end/parser'),
      "serializer": require('../nodes/end/serializer'),
      "rGroup": "demo",
      "tImage": "src/common/imgs/editor/Decision.png",
      "image": "src/common/imgs/editor/Decision.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "Decision",
      "name": "Decision",
      "label": "条件",
      "toolTip": "条件",
      "window": "start.figure.StartEvent",
      "parser": "start.figure.StartEvent",
      "serializer": "start.figure.StartEvent",
      "rGroup": "demo",
      "tImage": "src/common/imgs/editor/Decision.png",
      "image": "src/common/imgs/editor/Decision.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "Process",
      "name": "Process",
      "label": "分支",
      "toolTip": "分支",
      "window": "start.figure.StartEvent",
      "parser": "start.figure.StartEvent",
      "serializer": "start.figure.StartEvent",
      "rGroup": "demo",
      "tImage": "src/common/imgs/editor/Process.png",
      "image": "src/common/imgs/editor/Process.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "LogMiner",
      "name": "LogMiner",
      "label": "日志",
      "toolTip": "日志",
      "figrue": "start.figure.StartEvent",
      "window": "start.figure.StartEvent",
      "parser": "start.figure.StartEvent",
      "serializer": "start.figure.StartEvent",
      "model": "start.figure.StartEvent",
      "rGroup": "normal",
      "tImage": "src/common/imgs/editor/LogMiner.png",
      "image": "src/common/imgs/editor/LogMiner.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "DataAudit",
      "name": "DataAudit",
      "label": "数据审计",
      "toolTip": "数据审计",
      "figrue": "start.figure.StartEvent",
      "window": "start.figure.StartEvent",
      "parser": "start.figure.StartEvent",
      "serializer": "start.figure.StartEvent",
      "model": "start.figure.StartEvent",
      "rGroup": "normal",
      "tImage": "src/common/imgs/editor/DataAudit.png",
      "image": "src/common/imgs/editor/DataAudit.png",
      "inLimit": "-1",
      "outLimit": "-1"
    }
  ]
}
