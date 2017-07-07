package net.onlineshop.services.front.account.impl;

import java.io.File;
import java.text.MessageFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.log4j.Logger;

import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.ServersManager;
import net.onlineshop.core.emun.ProductType;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.pay.alipay.alipayescow.util.httpClient.HttpTookit;
import net.onlineshop.core.system.bean.User;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.core.util.FreemarkerTemplateUtil;
import net.onlineshop.core.util.ImageUtil;
import net.onlineshop.core.util.MD5;
import net.onlineshop.core.util.MailUtil;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.account.bean.Busi;
import net.onlineshop.services.front.account.bean.MebInfo;
import net.onlineshop.services.front.account.bean.MebPoint;
import net.onlineshop.services.front.account.bean.MebPrize;
import net.onlineshop.services.front.account.bean.MebWallet;
import net.onlineshop.services.front.account.bean.MebWalletLog;
import net.onlineshop.services.front.account.dao.AccountDao;
import net.onlineshop.services.front.email.EmailService;
import net.onlineshop.services.front.email.bean.Email;
import net.onlineshop.services.front.notifyTemplate.bean.NotifyTemplate;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.orderdetail.bean.Orderdetail;
import net.onlineshop.services.front.orderdetail.dao.OrderdetailDao;
import net.onlineshop.services.front.orderlog.bean.Orderlog;
import net.onlineshop.services.manage.accountRank.bean.AccountRank;

public class AccountServiceImpl extends ServersManager<Account> implements AccountService {
	private static final Logger logger = Logger.getLogger(AccountServiceImpl.class);
	private AccountDao accountDao;
	private EmailService emailService;
	private OrderService orderService;
	private OrderdetailDao orderdetailDao;
	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}

	
	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	

	public void setOrderdetailDao(OrderdetailDao orderdetailDao) {
		this.orderdetailDao = orderdetailDao;
	}


	public void setAccountDao(AccountDao accountDao) {
		this.accountDao = accountDao;
	}

	public int selectCount(Account e) {
		return accountDao.selectCount(e);
	}

	/**
	 * 更新会员信息。 如果会员等级发生变动，则需要使用邮件、短信、站内信的方式告知用户。
	 */
	// @Override
	// public int update(Account e) {
	// int r = 0;
	// if(StringUtils.isNotBlank(e.getRank())){
	// Account acc = accountDao.selectOne(e);
	// if(!acc.getRank().equals(e.getRank())){
	// int a = Integer.valueOf(acc.getRank().substring(1));
	// int b = Integer.valueOf(e.getRank().substring(1));
	// if( a > b){
	// //会员等级降了
	// r = -1;
	// }else if(a < b){
	// //会员等级升了
	// r = 1;
	// }else {
	// //等级没变化
	// r = 0;
	// }
	// }
	// }
	//
	// super.update(e);
	//
	// if(StringUtils.isNotBlank(e.getRank())){
	// if(r==-1){
	// //邮件、短信、或站内信通知用户
	// }else if(r==-1){
	// //邮件、短信、或站内信通知用户
	// }
	// }
	// return 1;
	// }

	@Override
	public void updateScore(Account acc) {
		if (StringUtils.isBlank(acc.getAccount())) {
			throw new NullPointerException();
		}

		synchronized (FrontContainer.update_account_score_lock) {
			Account account = accountDao.selectAccountScore(acc.getAccount());
			if (account == null) {
				throw new NullPointerException();
			}

			acc.setScore(acc.getAddScore() + account.getScore());

			logger.debug("SystemManager.accountRankMap = " + SystemManager.accountRankMap.size());
			for (Iterator<Entry<String, AccountRank>> it = SystemManager.accountRankMap.entrySet().iterator(); it.hasNext();) {
				Entry<String, AccountRank> item = it.next();
				AccountRank accountRank = item.getValue();
				if (acc.getScore() == accountRank.getMinScore() || acc.getScore() == accountRank.getMaxScore() || (acc.getScore() > accountRank.getMinScore() && acc.getScore() < accountRank.getMaxScore())) {
					// 得到此范围内的会员等级代号
					acc.setRank(accountRank.getCode());

					logger.debug(">>accountRank.getCode() = " + accountRank.getCode());
					break;
				}
			}

			logger.debug("account.getRank()=" + account.getRank() + ",acc.getRank()=" + acc.getRank());

			// 如果新的会员等级代号和旧的一样，则说明会员的等级没有发生任何的变化。不需要更新 也不需要邮件通知
			if (acc.getRank() != null) {
				if (acc.getRank().equals(account.getRank())) {
					acc.setRank(null);
				} else {
					int oldAccountRank = Integer.valueOf(account.getRank().substring(1));// 旧的会员等级
					int newAccountRank = Integer.valueOf(acc.getRank().substring(1));// 新的会员等级
					if (oldAccountRank > newAccountRank) {
						// 会员等级降了
					} else if (oldAccountRank < newAccountRank) {
						// 会员等级升了
					}
					// ..通知会员
				}
			}
			accountDao.updateScore(acc);
			// 可以邮件、短信、站内信 等方式通知用户，订单完成，积分已经打到用户的账户上了。
		}
	}

	public void insertOutAccount(Account acc) {
		synchronized (this) {
			if (acc == null) {
				throw new NullPointerException("acc is null");
			}

			acc.setAccount("_out_" + System.currentTimeMillis());
			acc.setNickname("_out_");
			accountDao.insert(acc);
			logger.debug("insertOutAccount.acc=" + acc);
		}
	}

	@Override
	public void doForget(Account e) {
		logger.debug("forget...account=" + e.getAccount());
		if (e == null || StringUtils.isBlank(e.getAccount())) {
			throw new NullPointerException("请求非法！");
		}

		Account acc = new Account();
		acc.setAccount(e.getAccount());
		acc = accountDao.selectOne(acc);
		if (acc == null) {
			throw new NullPointerException("根据账号查询不到指定的会员信息，请联系管理员！");
		}

		sendEmail(acc, NotifyTemplate.email_forget_password);
	}

	@Override
	public void sendEmail(Account e, String emailNotifyTemplateCode) {
		if (e == null || StringUtils.isBlank(e.getAccount())) {
			throw new NullPointerException("参数不能为空！");
		}

		String sign = System.currentTimeMillis() + e.getAccount();

		// 存储发送的邮件
		Email email = new Email();
		email.setAccount(e.getAccount());
		email.setType(emailNotifyTemplateCode);// Email.email_type_forget);
		email.setSign(MD5.md5(sign));
		String url = null;
		String emailTitle = null;
		// String emailHtml = null;
		if (emailNotifyTemplateCode.equals(NotifyTemplate.email_forget_password)) {// 找回密码邮件

			url = SystemManager.systemSetting.getWww() + "/user/reset.html?sign=" + email.getSign();
			emailTitle = "找回最灯饰的密码";
			// emailHtml = MessageFormat.format(SystemManager.systemSetting.getEmailFormat(), email.getAccount() , url);
		} else if (emailNotifyTemplateCode.equals(NotifyTemplate.email_reg)) {// 激活新注册账号的邮件

			url = SystemManager.systemSetting.getWww() + "/user/activeAccount.html?sign=" + email.getSign();
			emailTitle = "激活最灯饰的账号";
			// emailHtml = MessageFormat.format(SystemManager.systemSetting.getActiveAccountEmail(), email.getAccount() , url);
		} else if (emailNotifyTemplateCode.equals(NotifyTemplate.email_change_email)) {// 修改邮箱

			url = SystemManager.systemSetting.getWww() + "/user/active.html?sign=" + email.getSign();
			emailTitle = "激活最灯饰的账号";
			// emailHtml = MessageFormat.format(SystemManager.systemSetting.getChangeEmail(), email.getAccount() , url);
		} else {
			throw new NullPointerException("发送的邮件类型不明确！");
		}
		email.setUrl(url);
		Date dd = new Date();
		email.setStarttime(String.valueOf(dd.getTime()));// 当前时间
		email.setEndtime(String.valueOf(DateUtils.addHours(dd, 2).getTime()));// 当前时间+2小时
		email.setNewEmail(e.getNewEmail());// 新邮箱

		logger.debug("sign = " + sign + ",email.sign = " + email.getSign() + ",e.getEmail() = " + e.getEmail());
		// 发送邮件到用户的邮箱
		MailUtil mail = null;
		if (StringUtils.isNotBlank(e.getNewEmail())) {
			logger.debug("sendEmail 1 ");
			mail = new MailUtil(e.getNewEmail());// new MailUtil("543089122@qq.com",SystemManager.getInstance().get("from_email_account"),SystemManager.getInstance().get("from_email_password"),
													// SystemManager.getInstance().get("from_eamil_smtpServer"), "myshop注册验证邮件");//用户注册成功发送邮件
		} else {
			logger.debug("sendEmail 2 ");
			mail = new MailUtil(e.getEmail());
		}

		/**
		 * 根据模板代号获取模板内容，然后封装数据后作为HTML内容发送到用户的邮箱
		 */
		String template = SystemManager.notifyTemplateMap.get(NotifyTemplate.email_reg).getTemplate();
		if (StringUtils.isBlank(template)) {
			throw new NullPointerException("本系统可能不支持" + emailNotifyTemplateCode + "此模板代码！请联系管理员.");
		}
		Map<String, String> data = new HashMap<String, String>();
		data.put("nickname", e.getNickname());// 会员昵称
		data.put("system", SystemManager.systemSetting.getName());// 系统名称
		data.put("url", url);// 激活邮箱URL地址
		data.put("servicesPhone", SystemManager.systemSetting.getTel());// 系统客服电话
		data.put("systemEmail", SystemManager.systemSetting.getEmail());// 系统邮箱
		data.put("helpUrl", SystemManager.systemSetting.getWww() + "/help.html");// 系统帮助地址
		boolean result = mail.startSend(emailTitle, FreemarkerTemplateUtil.freemarkerProcess(data, template));
		logger.debug("email resule = " + result);

		if (result) {
			email.setSendStatus(Email.email_sendStatus_y);
		} else {
			email.setSendStatus(Email.email_sendStatus_n);
		}
		emailService.insert(email);
	}

	@Override
	public void updatePasswordByAccount(Account acc) {
		accountDao.updatePasswordByAccount(acc);
	}

	@Override
	public void updateEmailByAccount(Account acc) {
		accountDao.updateEmailByAccount(acc);
	}

	public static void main(String[] args) {
		// Object arguments;
		// String pattern = "你好{1}";
		// System.out.println(MessageFormat.format(pattern , 12,34));

		String content = "ab,cc,{1},{2},{0},dd,ff";
		Object array[] = { "userName", "password", "2014-10-12" };
		content = MessageFormat.format(content, array);
		System.out.println(content);
	}

	@Override
	public void updateDataWhenActiveAccount(Account acc, String account) {
		accountDao.update(acc);

		// 使激活的链接失效
		Email email = new Email();
		email.setAccount(account);
		email.setType(net.onlineshop.services.common.NotifyTemplate.email_reg);
		emailService.updateEmailInvalidWhenReg(email);
	}

	@Override
	public Account login(Account acc) {
		return accountDao.login(acc);
	}

	@Override
	public MebWallet getWallet(Integer wal) {
		// TODO Auto-generated method stub
		MebWallet m=new MebWallet();
		m.setMeb_id(wal);
		return accountDao.getWallet(m);
	}
	
	/**
	 * 获取积分
	 * @param mebId
	 * @return
	 */
	public MebPoint getPoint(String mebId){
		return accountDao.getPoint(mebId);
	}

	@Override
	public void updateWallet(Order order){
		//减掉消费积分
		ScoreProxy scoreProxy = order.getScoreProxy();
		float shop_free=-scoreProxy.getCutShopFree();
		if(shop_free!=0)
		{
			int mebId = Integer.parseInt(order.getAccount());
			MebWallet wal=new MebWallet();
			wal.setShop_free(shop_free);
			wal.setMeb_id(mebId);
			//记录日志
			saveWalletLog(order.getAccount(),-scoreProxy.getCutShopFree(),scoreProxy.getOldShopFree(),order.getId(),Busi.WALLET_TYPE_SHOP,null,false);
			accountDao.updateWallet(wal);
		}
	}
	

	/**
	 * @param order
	 * @param signMeb 签收者 1:客户签收,2:后天维护人员签收,3:定时器签收
	 */
	public synchronized String updateOrderToCompete(String orderDetailId,int owner) {
		Orderdetail el=new Orderdetail();
		el.setId(orderDetailId);
		el.setStatus(Order.order_status_send);
		Orderdetail orderDetail = orderdetailDao.selectOne(el);
		if(null==orderDetail) {
			return "无法找到订单详情,可能已经签收！";
		}
		Order order=orderService.selectById(orderDetail.getOrderID()+"");
		if(null==order) {
			return "无法找到订单！";
		}
		orderDetail.setSenddate(null); 
		orderDetail.setSigndate(DateUtil.dateFormat(new Date()));
		orderDetail.setStatus(Order.order_status_sign);
		orderdetailDao.update(orderDetail);

		Orderdetail orderDetailAll=new Orderdetail();
		orderDetailAll.setOrderID(orderDetail.getOrderID());
		List<Orderdetail> orderDetailList = orderdetailDao.selectList(orderDetailAll);
		//判断是否所有的已经签收
		boolean isAllSign=true;
		for (Orderdetail orderdetail2 : orderDetailList) {
			if(!Order.order_status_sign.equals(orderdetail2.getStatus())) {
				isAllSign=false;
				break;
			}
		}
		String logInfo=null;
		String logType=null;
		String account=null;
		switch (owner) {
			case 1:
				logType=Orderlog.orderlog_accountType_w;
				logInfo="【已签收】顾客更新订单为已签收,产品名称："+orderDetail.getProductName();
				account=order.getAccount();
				break;
	
			case 2:
				User user=getManagerUser();
				logType=Orderlog.orderlog_accountType_m;
				logInfo="【已签收】后台管理员代为签收,产品名称："+orderDetail.getProductName();
				account=user.getUsername();
				break;
			case 3:
				logType=Orderlog.orderlog_accountType_p;
				logInfo="【已签收】定时器更新订单为已签收,产品名称："+orderDetail.getProductName();
				account=order.getAccount();
				break;
		}
		orderService.insertOrderlog(order.getId(), logInfo, account, logType);
		if(isAllSign)
			updateSignStatus(order,orderDetailList,account,logType);
		return null;
	}


	/**
	 * 更新订单签收状态
	 * @param order
	 */
	private void updateSignStatus(Order order,List<Orderdetail> orderDetailList,String account,String logType) {
//		if(order.getCutGrowFree()>0f && !Busi.YES.equals(order.getIsReturnPoint()))
//		{
//			//消费钱包转换成的积分
//			MebPoint mebPoint=new MebPoint();
//			mebPoint.setMeb_id(Integer.parseInt(order.getAccount()));
//			MebPoint point = getPoint(order.getAccount());
//			float traferPoint=0f;
//			for (Orderdetail orderdetail : orderDetailList) {
//				if(ProductType.DONATION.getCode().equals(orderdetail.getProductType()+""))
//					traferPoint += orderdetail.getReurnScore() * orderdetail.getNumber();
//			}
//			mebPoint.setPoint_free(traferPoint);
//			//最终返利额度
//			float pointFree=traferPoint/order.getPoint2money();
//			//记录日志
//			if(pointFree>0)
//				saveWalletLog(order.getAccount(),pointFree,point.getPoint_free(),order.getId(),Busi.WALLET_TYPE_POINT,Busi.WALLET_CHANGE_ORDER_FIN);
//			accountDao.updatePoint(mebPoint);
//		}
		//签收订单
		order.setStatus(Order.order_status_sign);
//		order.setIsReturnPoint(Busi.YES);
		order.setSigndate(DateUtil.dateFormat(new Date())); 
		orderService.update(order);
		orderService.insertOrderlog(order.getId(), "【订单签收成功】,订单状态为签收。", account,logType);
	}
	
	
//	@Override
//	public synchronized String updateOpenStatusToPass(net.onlineshop.services.manage.order.bean.Order mOrder) {
//		//更新额度
//		Order order = orderService.selectById(mOrder.getId());
//		if(!Order.order_status_sure.equals(order.getStatus()))
//		{
//			logger.info("updateOpenStatusToPass 重复提交的订单，订单状态不正确，OrderNo"+order.getOrderNo()+" OrderId:"+order.getId());
//			throw new RuntimeException("重复提交了数据!"); 
//		}
//		order.getScoreProxy().totalCacl(order);
//		order.setStatus(Order.order_status_pass);
//		order.setIsSaveScoreFinal(mOrder.getIsSaveScoreFinal());
//		//是否保留积分
//		Boolean isSaveFinal=Busi.YES.equals(order.getIsSaveScoreFinal());
//		if(!order.getIsSaveScoreFinal().equals(order.getIsSaveScore())) {
//			if(isSaveFinal) {
//				order.setCutMoney(order.getReurnScore()+order.getCutMoney());
//			}
//			else {
//				order.setCutMoney(order.getCutMoney()-order.getReurnScore());
//			}
//		}
//		orderService.update(order);
//		//同步订单明细
//		Orderdetail od=new Orderdetail();
//		od.setOrderID(Integer.parseInt(order.getId()));
//		od.setStatus(order.getStatus());
//		orderdetailDao.update(od);
////		Float returnScore=order.getScoreProxy().getReturnScore();
////		//是否保留积分
////		if(returnScore>0) {
////			Map<String ,Object> map=new HashMap<String,Object>();
////			map.put("entry_stage", returnScore);
////			map.put("meb_id",order.getAccount());
////			accountDao.updateStatistics(map);
////		}
//		//增加积分
////		if(isSaveFinal && returnScore>0f)
////		{
////			int mebId = Integer.parseInt(order.getAccount());
////			ScoreProxy scoreProxy = order.getScoreProxy();
////			MebPoint mebPoint=new MebPoint();
////			float addPointFree=scoreProxy.getReturnScore()/order.getPoint2money();
////			mebPoint.setPoint_free(addPointFree);
////			mebPoint.setMeb_id(mebId);
////			saveWalletLog(order.getAccount(),addPointFree,scoreProxy.getOldPointFree(),order.getId(),Busi.WALLET_TYPE_POINT,Busi.WALLET_CHANGE_ORDER_FIN);
////			accountDao.updatePoint(mebPoint);
////		}
//		User user = getManagerUser();
//		orderService.insertOrderlog(order.getId(), "【确认打款截图】,确认金额："+order.getCutMoney(), user.getUsername(), Orderlog.orderlog_accountType_m);
//		return order.getAccount();
//	}
	
	/**
	 * 返还积分和钱包
	 */
	@Override
	public synchronized String cancalOrder(String id,Boolean isCustome,final String ...args) {
		Order order = orderService.selectById(id);
		String status=order.getStatus();
		//只有代付款，截图待确认，审核通过（即；未发货的订单都可以取消）
		if(!status.equals(Order.order_status_pass) && !status.equals(Order.order_status_init) && !status.equals(Order.order_status_sure)) {
			return "订单状态不正确，请确认订单状态！";
		}
		if(order.getCutMoney()>0f && status.equals(Order.order_status_pass)) {
			return "开单商品已经审核后，无法取消订单！";
		}
		if(status.equals(Order.order_status_pass) || status.equals(Order.order_status_sure))
		{
			float cutShopFree=order.getCutShopFree();
			//返还钱包
			if(cutShopFree>0)
			{
				int accountId = Integer.parseInt(order.getAccount());
				 
				MebWallet wal=new MebWallet();
				wal.setShop_free(cutShopFree);
				wal.setMeb_id(accountId);
				MebWallet currentWallet=getWallet(accountId);
				saveWalletLog(order.getAccount(),cutShopFree,currentWallet.getShop_free(),order.getId(),Busi.WALLET_TYPE_SHOP,Busi.WALLET_CHANGE_ORDER_CANCEL,false);
				accountDao.updateWallet(wal);
			}
			float pointFree=order.getCutPointFree();
//			float point2Free=order.getCutPoint2Free();
			//返还积分
			if(pointFree>0)
			{
				MebPoint currentPoint = getPoint(order.getAccount());
				MebPoint mebPoint=new MebPoint();
//				mebPoint.setPoint2_free(point2Free);
				mebPoint.setPoint_free(pointFree);
				mebPoint.setMeb_id(Integer.parseInt(order.getAccount()));
				if(pointFree>0f)
					saveWalletLog(order.getAccount(),pointFree,Float.valueOf(""+currentPoint.getPoint_free()),order.getId(),Busi.WALLET_TYPE_POINT,Busi.WALLET_CHANGE_ORDER_CANCEL,true);
//				if(point2Free>0f)
//					saveWalletLog(order.getAccount(),point2Free,Float.valueOf(""+currentPoint.getPoint2_free()),order.getId(),Busi.WALLET_TYPE_POINT2,Busi.WALLET_CHANGE_ORDER_CANCEL);
				accountDao.updatePoint(mebPoint);
			}
		}
		
		Order dborder = new Order();
		dborder.setId(id);
		dborder.setStatus(Order.order_status_cancel);
		dborder.setPaystatus(Order.order_paystatus_n);
		orderService.update(dborder);
		String logInfo=null;
		String logType=null;
		//如果是客户取消订单
		if(isCustome)
		{
			logType=Orderlog.orderlog_accountType_w;
			logInfo="客户主动取消订单！";
		}
		else
		{
			User user = getManagerUser();
			logInfo="【取消订单】后端操作人："+user.getId()+",姓名："+user.getUsername();
			logType=Orderlog.orderlog_accountType_m;
			//打款截图取消才发短信
			if(status.equals(Order.order_status_sure))
			{
				final String noticeCancelOpen=CoreParamCache.getInstance().get("noticeCancelOpen")+order.getAccount();
				HttpTookit.sendGet(noticeCancelOpen);
			}
		}
		orderService.insertOrderlog(order.getId(), logInfo, order.getAccount(), logType);
		return null;
	}
	

	@Override
	public void updatePoint(Order order) {
		int mebId = Integer.parseInt(order.getAccount());
		ScoreProxy scoreProxy = order.getScoreProxy();
//		String  isPayTicket=order.getIsPayTicket();
		MebPoint mebPoint=new MebPoint();
		mebPoint.setMeb_id(mebId);
//		if(Busi.YES.equals(isPayTicket)) {
//			float userScoreTicket=-order.getCutPoint2Free();
//			saveWalletLog(order.getAccount(),userScoreTicket,scoreProxy.getOldPoint2Free(),order.getId(),Busi.WALLET_TYPE_POINT2,null);
//			mebPoint.setPoint2_free(userScoreTicket);
//		}
//		else {
			float cutPointFree = -order.getCutPointFree();
			mebPoint.setPoint_free(cutPointFree);
			saveWalletLog(order.getAccount(),cutPointFree,scoreProxy.getOldPointFree(),order.getId(),Busi.WALLET_TYPE_POINT,null,true);
//		}
		accountDao.updatePoint(mebPoint);
	}
	

	@Override
	public void saveWalletLog(String mebId, Float incValue,Float nowValue, String changeId,String walletType,String changeReason,boolean isPoint) {
		// TODO Auto-generated method stub
		if(incValue!=0f)
		{
			MebWalletLog mebWalletLog = new MebWalletLog();
			mebWalletLog.setMeb_id(Integer.valueOf(mebId));
			// 变更对象
			mebWalletLog.setWallet_type(walletType);
			mebWalletLog.setWallet_sub_type(Busi.WALLET_SUB_TYPE_FREE);
			mebWalletLog.setChange_amount(incValue);// 变更金额
			mebWalletLog.setNew_amount(nowValue + incValue);
			// 变更原因，如果不填，默认是下单
			mebWalletLog.setChange_reason(StringUtils.isEmpty(changeReason)?Busi.WALLET_CHANGE_ORDER:changeReason);
			mebWalletLog.setChange_id(Integer.valueOf(changeId));
			if(isPoint) {
				accountDao.insertPointLog(mebWalletLog);
			}
			else {
				accountDao.insertWalletLog(mebWalletLog);
			}
			
		}
	}


	@Override
	public MebInfo getMebInfo(String id) {
		return accountDao.getMebInfo(id);
	}


	@Override
	public MebPrize getMebPrize(MebPrize wal) {
		return accountDao.getMebPrize(wal);
	}


	@Override
	public void updateMebPrize(MebPrize wal) {
		accountDao.updateMebPrize(wal);
	}
 
}
