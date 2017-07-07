import CommonPrototype from './prototypes/CommonPrototype';//公用的Prototype

module.exports = {
    /**********************公用组件****************************/
    BreadCrumb: require("./component/breadcrumb"),
    StepsFooter: require("./component/stepsfooter"),
    LabelSelect: require("./component/labelselect"),
    SearchInput: require("./component/searchinput"),
    AddRowTable: require("./component/addrowtable"),
    RestrictInput: require("./component/restrictinput"),
    RestrictTextarea: require("./component/restricttextarea"),
    FormFooter: require("./component/formfooter"),
    BFDTabs: require("./component/tabs"),
    ConfirmModal: require("./component/confirmdeletemodal"),
    StepsContainer: require("./component/stepscontainer"),
    Collapse: require("./component/collapse"),
    ValidateTable:require("./component/validatetable"),
    //公用方法
    CommonUtil: require("./utils/CommonUtil.js"),
    BfdRequest: require("./request/AjaxRequest.js"),
    RestrictConst: require("./utils/RestrictConst.js"),
    BaseValidate: require("./utils/BaseValidate.js")
}