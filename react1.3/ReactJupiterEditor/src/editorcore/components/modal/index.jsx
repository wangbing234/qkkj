/**
 * 时间: 16/4/27 11:11
 * 作者: zhongxia
 * 说明: 直接在 BFD-UI的 Modal 组件上进行修改
 *      复制源码,是防止 BFD-UI组件升级,导致弹框不能用的情况
 * 使用方式:
 * that.refs._modal.open()   / close()    打开弹窗和关闭弹窗的方法
 *
 * <Modal ref="_modal">
 *   弹框内容,请随意
 * </Modal>
 *
 * 属性:
 * 1. okHandler     确定操作
 * 2. closeHandler  关闭操作
 * 3. title         标题             默认: 提示
 * 4. showFooter    是否显示底部按钮  默认: true
 * 5. showHeader    是否显示顶部标题  默认: true
 */
import Modal from './Modal'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'

export default Modal
export { Modal, ModalHeader, ModalBody }