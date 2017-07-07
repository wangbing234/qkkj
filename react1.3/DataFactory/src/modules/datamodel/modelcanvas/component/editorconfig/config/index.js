/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:配置所有的图元类
 *
 ***************************************************/
export default {
  "group": [
    {
      "id": "normal",
      "name": "normal",
      "label": " "
    }
  ],
  "line": {
    "name": "line",
    "label": "线段",
    "toolTip": "线段",
    "parser": require('../nodes/line/parser'),
    "serializer": require('../nodes/line/serializer'),
  },
  n: {},
  "node": [
    {
      "id": "hive",
      "name": "hive",
      "label": "hive",
      "toolTip": "Hive",
      "data-code":"1020603",
      "window": require('../nodes/hive/win'),
      "parser": require('../nodes/hive/parser'),
      "serializer": require('../nodes/hive/serializer'),
      "rGroup": "demo",
      "tImage": "src/common/img/editor/tools/hiveIcon.png",
      "image": "src/common/img/editor/hiveIcon.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "hbase",
      "name": "hbase",
      "label": "hbase",
      "toolTip": "HBase",
      "data-code":"1020604",
      "window": require('../nodes/hbase/win'),
      "parser": require('../nodes/hbase/parser'),
      "serializer": require('../nodes/hbase/serializer'),
      "rGroup": "demo",
      "tImage": "src/common/img/editor/tools/hbaseIcon.png",
      "image": "src/common/img/editor/hbaseIcon.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "rdbms",
      "name": "rdbms",
      "label": "rdbms",
      "toolTip": "RDBMS",
      "data-code":"1020605",
      "window": require('../nodes/oracle/win'),
      "parser": require('../nodes/oracle/parser'),
      "serializer": require('../nodes/oracle/serializer'),
      "rGroup": "demo",
      "tImage": "src/common/img/editor/tools/rdbmsIcon.png",
      "image": "src/common/img/editor/rdbmsIcon.png",
      "inLimit": "-1",
      "outLimit": "-1"
    },
    {
      "id": "join",
      "name": "join",
      "label": "join",
      "toolTip": "汇聚",
      "data-code":"",
      "window": require('../nodes/join/win'),
      "parser": require('../nodes/join/parser'),
      "serializer": require('../nodes/join/serializer'),
      "rGroup": "normal",
      "tImage": "src/common/img/editor/tools/fedIcon.png",
      "image": "src/common/img/editor/fedIcon.png",
      "inLimit": "-1",
      "outLimit": "-1"
    }
  ]
}
