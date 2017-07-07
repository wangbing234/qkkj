package net.onlineshop.services.front.account.bean;

public class Busi {
	public static final String YES = "1";
	public static final String NO = "0";

	// 钱包类别
	public static final String WALLET_TYPE_BASE = "1"; // 公益钱包
	public static final String WALLET_TYPE_SHOP = "4"; // 推广钱包
//	public static final String WALLET_TYPE_SHOP = "3"; // 消费钱包
//	public static final String WALLET_TYPE_REWARD = "4"; // 推荐钱包
	public static final String WALLET_TYPE_GAME = "5"; // 排单币
	public static final String WALLET_TYPE_ACTIVE = "6"; // 激活码
	public static final String WALLET_TYPE_POINT = "3"; // 交易积分（------修改）
	public static final String WALLET_TYPE_POINT2 = "8"; // 消费积分

	// 钱包子类别
	public static final String WALLET_SUB_TYPE_FREE = "1"; // 可用
	public static final String WALLET_SUB_TYPE_FREEZE = "2"; // 冻结
	public static final String WALLET_SUB_TYPE_ENTRY = "3"; // 待转入
	public static final String WALLET_SUB_TYPE_EXIT = "4"; // 待转出

	// 财务变化原因
	public static final String WALLET_CHANGE_ENTRY = "1"; // 捐赠
	public static final String WALLET_CHANGE_EXIT = "2"; // 提取
	public static final String WALLET_CHANGE_MATCH_FIN = "3"; // 确认收款
	public static final String WALLET_CHANGE_UNFREEZE = "4"; // 利息解冻
	public static final String WALLET_CHANGE_ORDER = "16"; // 下单（------修改）
	public static final String WALLET_CHANGE_OPEN_ORDER_FIN = "6"; // 确认开单收货
	public static final String WALLET_CHANGE_MAX_STAGE = "7"; // 满额捐赠
	public static final String WALLET_CHANGE_LEVELUP = "8"; // 会员升级
	public static final String WALLET_CHANGE_BONUS_DAILY = "9"; // 捐赠日息
	public static final String WALLET_CHANGE_ACTIVE_BACK = "a"; // 首次满固定数额返还激活码
	public static final String WALLET_CHANGE_MANUAL = "0"; // 人工调账
	public static final String WALLET_CHANGE_ORDER_FIN = "b"; // 确认收货
	public static final String WALLET_CHANGE_ORDER_CANCEL = "17"; // 退款(取消)（------修改）
	// 用户类别
	public static final String MEB_OUTTER = "1"; // 外部用户
	public static final String MEB_INNER = "2"; // 内部用户
	public static final String MEB_VIP = "3"; // VIP用户

	// 用户状态
	public static final String MEB_STATE_OK = "1"; // 正常
	public static final String MEB_STATE_UNAUTH = "2"; // 未实名认证
	public static final String MEB_STATE_UNACTIVE = "3"; // 未激活
	public static final String MEB_STATE_LOCK = "4"; // 已冻结
	public static final String MEB_STATE_CLOSE = "5"; // 已销户

	// 用户状态变更原因
	public static final String MEB_STATE_CHANGE_REG = "1"; // 注册
	public static final String MEB_STATE_CHANGE_AUTH = "2"; // 实名认证
	public static final String MEB_STATE_CHANGE_ACTIVE = "3"; // 激活
	public static final String MEB_STATE_CHANGE_LOCK = "4"; // 冻结
	public static final String MEB_STATE_CHANGE_UNLOCK = "5"; // 解冻
	public static final String MEB_STATE_CHANGE_UNREG = "6"; // 销户

	// 捐赠类别
	public static final String ENTRY_TYPE_ENTRY = "1"; // 主动捐赠
	public static final String ENTRY_TYPE_EXIT = "2"; // 提取复捐

	// 捐赠分单类别
	public static final String ENTRY_SUB_TYPE_NORMAL = "1"; // 一般捐赠
	public static final String ENTRY_SUB_TYPE_PRI = "2"; // 优先匹配

	// 提取类别
	public static final String EXIT_TYPE_BASE = "1"; // 公益
	public static final String EXIT_TYPE_GROW = "2"; // 推广
	public static final String EXIT_TYPE_SYS = "3"; // 系统

	// 主单状态（捐赠、提取公用）
	public static final String MASTER_STATE_INIT = "1"; // 未完成
	public static final String MASTER_STATE_FINISH = "2"; // 已完成
	public static final String MASTER_STATE_UNFREEZE = "3"; // 利息解冻

	// 分单状态（捐赠、提取公用）
	public static final String SUB_STATE_INIT = "1"; // 未匹配
	public static final String SUB_STATE_MATCH = "2"; // 已匹配
	public static final String SUB_STATE_FINISH = "3"; // 已完成
	public static final String SUB_STATE_UNFREEZE = "4"; // 利息解冻（捐赠分单）
	public static final String SUB_STATE_NOTICE = "5"; // 已通知匹配

	// 匹配类别
	public static final String MATCH_TYPE_AUTO = "1"; // 自动
	public static final String MATCH_TYPE_MANUAL = "2"; // 人工

	// 匹配状态
	public static final String MATCH_STATE_SYS = "1"; // 已系统匹配
	public static final String MATCH_STATE_MATCH = "2"; // 已通知匹配
	public static final String MATCH_STATE_TRANS = "3"; // 已打款
	public static final String MATCH_STATE_FIN = "4"; // 已确认

	// 超时状态
	public static final String OVERTIME_STATE_OK = "1"; // 未超时
	public static final String OVERTIME_STATE_PAY = "2"; // 打款超时
	public static final String OVERTIME_STATE_CONFIRM = "3"; // 确认收款超时

	// 订单状态
	public static final String ORDER_STATE_INIT = "1"; // 已下单
	public static final String ORDER_STATE_POST = "2"; // 已发货
	public static final String ORDER_STATE_FIN = "3"; // 已收货
	public static final String ORDER_STATE_CANCEL = "4"; // 已取消

	// 开单订单财务确认状态
	public static final String OPEN_ORDER_STATE_INIT = "1"; // 未上传截图
	public static final String OPEN_ORDER_STATE_UPLOAD = "2"; // 已上传截图
	public static final String OPEN_ORDER_STATE_FIN = "3"; // 已财务确认
	public static final String OPEN_ORDER_STATE_CANCEL = "4"; // 已取消

	// 虚拟币类别
	public static final String COIN_TYPE_ACTIVE = "1"; // 激活码
	public static final String COIN_TYPE_GAME = "2"; // 排单币

	// 虚拟币变更类别
	public static final String COIN_TRANS_TYPE_SYS = "1"; // 系统分配
	public static final String COIN_TRANS_TYPE_MEB = "2"; // 会员互赠
	public static final String COIN_TRANS_TYPE_USED = "3"; // 使用
	public static final String COIN_TRANS_TYPE_SIGN = "4"; // 签到奖励

	// 图片分类命名前缀
	public static final String IMG_TYPE_PRE_PRODUCT = "/product/product_"; // 商品
	public static final String IMG_TYPE_PRE_MATCH = "/match/match_"; // 付款回执单
	public static final String IMG_TYPE_PRE_AUTH = "/auth/auth_"; // 实名认证
	public static final String IMG_TYPE_PRE_LEVEL = "/level/level_"; // 会员等级
	public static final String IMG_TYPE_PRE_OPEN = "/open/open_"; // 开单商城商品
	public static final String IMG_TYPE_PRE_OPEN_ORDER = "/openOrder/openOrder_"; // 开单订单打款截图

	// 短信类型
	public static final String SMS_TYPE_MEMBERREG = "1"; // 会员注册
	public static final String SMS_TYPE_MODIFYPWD = "2"; // 修改密码
	public static final String SMS_TYPE_FREEZE = "3"; // 会员冻结
	public static final String SMS_TYPE_UNFREEZE = "4"; // 会员解冻
	public static final String SMS_TYPE_TOPAY = "5"; // 通知打款
	public static final String SMS_TYPE_TOCONFIRM = "6"; // 通知收款
	public static final String SMS_TYPE_ORDERPOSTED = "7"; // 通知已发货
	public static final String SMS_TYPE_OPENORDER_CONFIRM = "8"; // 开单订单确认
	public static final String SMS_TYPE_OPENORDER_CANCEL = "9"; // 开单订单取消

	// 留言状态
	public static final String MSG_STATE_INIT = "1"; // 待处理
	public static final String MSG_STATE_FINISH = "2"; // 已处理

	// 推荐人变更原因
	public static final String REFEREE_CHANGE_MANUAL = "1"; // 人工调整
	public static final String REFEREE_CHANGE_UNREG = "2"; // 会员销号
}
