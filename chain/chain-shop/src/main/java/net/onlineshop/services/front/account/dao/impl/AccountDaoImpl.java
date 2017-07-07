package net.onlineshop.services.front.account.dao.impl;import java.util.List;import java.util.Map;import org.slf4j.LoggerFactory;import net.onlineshop.core.dao.BaseDao;import net.onlineshop.core.dao.page.PagerModel;import net.onlineshop.services.front.account.bean.Account;import net.onlineshop.services.front.account.bean.MebInfo;import net.onlineshop.services.front.account.bean.MebPoint;import net.onlineshop.services.front.account.bean.MebPrize;import net.onlineshop.services.front.account.bean.MebWallet;import net.onlineshop.services.front.account.bean.MebWalletLog;import net.onlineshop.services.front.account.dao.AccountDao;import net.onlineshop.web.action.manage.order.OrderAction;public class AccountDaoImpl implements AccountDao {	private BaseDao dao;	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(AccountDaoImpl.class);	public void setDao(BaseDao dao) {		this.dao = dao;	}	public PagerModel selectPageList(Account e) {		return dao.selectPageList("front.account.selectPageList", "front.account.selectPageCount", e);	}	public List selectList(Account e) {		return dao.selectList("front.account.selectList", e);	}	public Account selectOne(Account e) {		return (Account) dao.selectOne("front.account.selectOne", e);	}	public int delete(Account e) {		return dao.delete("front.account.delete", e);	}	public int update(Account e) {		return dao.update("front.account.update", e);	}	public int deletes(String[] ids) {		Account e = new Account();		for (int i = 0; i < ids.length; i++) {			e.setId(ids[i]);			delete(e);		}		return 0;	}	public int insert(Account e) {		return dao.insert("front.account.login.insert", e);	}	public int deleteById(int id) {		return dao.delete("front.account.deleteById", id);	}	@Override	public Account selectById(String id) {		Account account=(Account) dao.selectOne("front.account.selectById", id);		if(account!=null) {			account.setMebInfo(getMebInfo(id));		}		return account;	}			public MebInfo getMebInfo(String id){		MebInfo tepmebBasic=new MebInfo();		tepmebBasic.setMeb_id(Integer.parseInt(id));		return (MebInfo) dao.selectOne("front.account.cqs.login", tepmebBasic);	}	public int selectCount(Account e) {		return dao.getCount("front.account.selectCount", e);	}	@Override	public void updatePasswordByAccount(Account acc) {		dao.update("front.account.updatePasswordByAccount", acc);	}	@Override	public void updateEmailByAccount(Account acc) {		dao.update("front.account.updateEmailByAccount", acc);	}	@Override	public Account selectAccountScore(String account) {		return (Account) dao.selectOne("front.account.selectAccountScore", account);	}	@Override	public void updateScore(Account acc) {		dao.update("front.account.updateScore", acc);	}		/**	 * 获取钱包数据	 * @param acc	 * @return	 */	public MebWallet getWallet(MebWallet wal){		MebWallet tepWallet = (MebWallet) dao.selectOne("front.account.cqs.wallet", wal);		return tepWallet;	}		public MebPrize getMebPrize(MebPrize wal){		MebPrize tepWallet = (MebPrize) dao.selectOne("front.prize.selectOne", wal);		return tepWallet;	}		public void updateMebPrize(MebPrize wal){		dao.update("front.prize.update", wal);	}		/**	 * 获取钱包数据	 * @param acc	 * @return	 */	public MebPoint getPoint(String mebId){		//查询积分		MebPoint mebPoint=new MebPoint();		mebPoint.setMeb_id(Integer.parseInt(mebId));		return (MebPoint) dao.selectOne("front.account.cqs.point", mebPoint);	}	@Override	public Account login(Account acc) {		//查询本地账户是否存在		MebInfo mebBasic =(MebInfo) dao.selectOne("front.account.cqs.login", acc.getMebInfo());		if(mebBasic==null){			logger.error("无法查询用户基本信息！！！");			return null;		}		Account tmpAccount=new Account();		tmpAccount.setId(mebBasic.getMeb_id()+"");		Account account=(Account) dao.selectOne("front.account.login", tmpAccount);		if(account==null) {			account=new Account();			account.setMebInfo(mebBasic);			account.setTel(mebBasic.getMeb_phone());			insert(account);		}		else{			account.setMebInfo(mebBasic);		}		String accountId=account.getId();		MebPoint point = getPoint(accountId);		if(null!=point) {			MebWallet wallet=new MebWallet();			wallet.setMeb_id(Integer.parseInt(accountId));			wallet=getWallet(wallet);			if(null!=wallet) {				point.setPoint2_free(wallet.getShop_free());			}			else {				logger.error("无法查询到钱包数据！！！");			}			account.setMebPoint(point);		}		else {			logger.error("无法查询到积分数据！！！");		}				return account;	}			@Override	public void updateWallet(MebWallet wal) {		dao.update("front.account.wallet.update", wal);	}	@Override	public void updatePoint(MebPoint wal) {		dao.update("front.account.point.update", wal);	}		@Override	public void insertWalletLog(MebWalletLog wal) {		dao.insert("front.account.walletlog.insert", wal);	}		@Override	public void insertPointLog(MebWalletLog wal) {		dao.insert("front.account.pointlog.insert", wal);	}//	@Override//	public void updateStatistics(Map<String, Object> map) {//		// TODO Auto-generated method stub//		dao.update("front.account.statistics.update", map);//	}		}