package com.qkkj.pay.repo.dao;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.qkkj.pay.domain.entity.BusiOrderEntity;
import com.qkkj.pay.domain.entity.LinkedPayPlatReqEntity;
import com.qkkj.pay.domain.entity.LinkedPayReturnEntity;
import com.qkkj.pay.domain.entity.PlatOrderEntity;
import com.qkkj.pay.domain.entity.WorkKeyEntity;
import com.qkkj.pay.domain.req.PaymentReq;
import com.qkkj.pay.domain.req.PaymentReturnReq;
import com.qkkj.pay.domain.req.QueryBusiOrderReq;
import com.qkkj.pay.repo.BusiOrderRepository;
import com.qkkj.pay.repo.LinkedPayPlatRepository;
import com.qkkj.pay.repo.PlatOrderRepository;
import com.qkkj.pay.repo.WorkKeyRepository;

@Repository("paymentDao")
public class PaymentDao 
{
	private final  Logger logger = LoggerFactory.getLogger(PaymentDao.class);
	
	@Autowired
	private WorkKeyRepository workKeyDao;
	
	@Autowired
	private BusiOrderRepository busiOrderDao;
	
	@Autowired
	private LinkedPayPlatRepository linkedPayPlatDao;
	
	@Autowired
	private PlatOrderRepository platOrderDao;
	
    @PersistenceContext  
    EntityManager entityManager; 
	
	
	/**
	 * 添加workKey记录
	 * @param WorkKeyEntity
	 */
	@Transactional
	public void addWorkKeyRepository(WorkKeyEntity WorkKeyEntity)
	{
		logger.info("addWorkKeyRepository start ");
		workKeyDao.save(WorkKeyEntity);
	}
	
	/**
	 * 根据日期查询workKey 
	 * @param today
	 * @return
	 */
	public WorkKeyEntity getWorkKeyEntityByDay(String today)
	{
		return workKeyDao.findByDay(today);
	}
	
	/**
	 * @author smart迅
	 *添加支付平台回调的请求参数
	 * @param payEntity
	 * @return
	 */
	public LinkedPayReturnEntity addLinkedPayReturnRepository(Session session,LinkedPayReturnEntity payEntity)
	{
		session.save(payEntity);
		return payEntity; 
	}
	
	/**
	 * @author smart迅
	 *保存客户端发起请求参数
	 * @param busiOrderEntity
	 */
	
	public BusiOrderEntity addBusiOrderEntity(BusiOrderEntity busiOrderEntity)
	{
		return busiOrderDao.save(busiOrderEntity);
	}
	
	/**
	 * @author smart迅
	 *添加支付平台封装的请求体信息
	 * @param payPlatReqEntity
	 * @return
	 */
	
	public PlatOrderEntity addPayPlatReqEntity(PlatOrderEntity platOrderEntity)
	{
		return platOrderDao.save(platOrderEntity);
	}
	
	/**
	 * @author smart迅
	 *添加统一支付平台所需请求体
	 * @param linkedPayPlatReqEntity
	 * @return
	 */
	public LinkedPayPlatReqEntity addLinkedPayPlatEntity(LinkedPayPlatReqEntity linkedPayPlatReqEntity)
	{
		return linkedPayPlatDao.save(linkedPayPlatReqEntity);
	}
	
	/**
	 * @author smart迅
	 *回调成功后，客户端订单状态修改为已成功
	 * @param orderNo
	 */
	
	public int updatebusiOrderStatues(Session session,PaymentReturnReq req)
	{
		logger.info("updatebusiOrderStatues start req={}",req);
		String sql = " UPDATE t_busiorder AS t_bus SET statues =?,update_time =?  WHERE id = (SELECT id FROM `t_linkedpayreq` WHERE order_no = ?)";
        SQLQuery query = session.createSQLQuery(sql);  
        query.setParameter(0, "2");
        query.setParameter(1, new Timestamp(System.currentTimeMillis()));
        query.setParameter(2, req.getData().getOrder_no());
        return query.executeUpdate();
	}
	/**
	 * @author smart迅
	 *二次提交，根据id更新支付str,以及时间
	 * @param orderNo
	 */
	
	public int updatebusiOrder(Session session,BusiOrderEntity entity)
	{
		logger.info("updatebusiOrderStatues start entity={}",entity);
		String sql = " UPDATE t_busiorder SET html_str =?,update_time =?,return_url=?  WHERE id =?";
		SQLQuery query = session.createSQLQuery(sql);  
		query.setParameter(0, entity.getHtmlStr());
		query.setParameter(1, entity.getUpdateTime());
		query.setParameter(2, entity.getReturnUrl());
		query.setParameter(3, entity.getID());
		return query.executeUpdate();
	}
	
	/**
	 * @author smart迅
	 *订单信息即将返回给客户端之前，先将html信息存在数据库
	 * @param session
	 * @param htmlStr
	 * @param req
	 * @return
	 */
	public int updatebusiOrderHtmlStr(Session session,String htmlStr,PaymentReq req)
	{
		logger.info("updatebusiOrderHtmlStr start ");
		String sql = " UPDATE t_busiorder AS t_bus SET html_str =?,update_time =?  WHERE order_no =?  AND busi_type =?";
        SQLQuery query = session.createSQLQuery(sql);  
        query.setParameter(0, htmlStr);
        query.setParameter(1, new Timestamp(System.currentTimeMillis()));
        query.setParameter(2, req.getOrder_no());
        query.setParameter(3, req.getBusiType());
        return query.executeUpdate();
	}
	
	/**
	 * @author smart迅
	 *更新支付域数据记录
	 * @param req
	 */
	
	public int updatePlatOrder(Session updateSession,PaymentReturnReq req)
	{
    	logger.info("updatePlatOrder req={}",req);
		String sql = "UPDATE `t_platorder` SET ret_code =? ,ret_msg =?,update_time=? ,statues=? WHERE exorder_num=?";
    	SQLQuery updatequery = updateSession.createSQLQuery(sql);  
    	updatequery.setParameter(0, req.getTrade_state());
    	updatequery.setParameter(1, req.getTrade_msg());
    	updatequery.setParameter(2, new Timestamp(System.currentTimeMillis()));
    	updatequery.setParameter(3, "2");
    	updatequery.setParameter(4, req.getData().getOrder_no());
    	return updatequery.executeUpdate();
	}
	/**
	 * @author smart迅
	 *二次支付，更新支付平台数据
	 * @param req
	 */
	
	public int updatePlatOrder(Session updateSession,String id,Timestamp time,String orderNo)
	{
		logger.info("updatePlatOrder start id={}",id);
		String sql = "UPDATE `t_platorder` SET update_time=? ,exorder_num=? WHERE id=?";
		SQLQuery updatequery = updateSession.createSQLQuery(sql);  
		updatequery.setParameter(0, time);
		updatequery.setParameter(1, orderNo);
		updatequery.setParameter(2, id);
		return updatequery.executeUpdate();
	}
	
	public int updateLinkPayReq(Session updateSession,String id,Timestamp time,String orderNo)
	{
		logger.info("updatePlatOrder start id={}",id);
		String sql = "UPDATE `t_linkedpayreq`  SET pay_timestamp=? , order_no=? WHERE id=?";
		SQLQuery updatequery = updateSession.createSQLQuery(sql);  
		updatequery.setParameter(0, time);
		updatequery.setParameter(1, orderNo);
		updatequery.setParameter(2, id);
		return updatequery.executeUpdate();
	}
	/**
	 * @author smart迅
	 *根据客户端代号+订单号查询订单状态
	 * @param req
	 * @return
	 */
	public BusiOrderEntity getBusiOrderInfo(QueryBusiOrderReq req)
	{
		logger.info("getBusiOrderInfo start req={}",req);
		Session session = entityManager.unwrap(org.hibernate.Session.class);  
		Criteria cri = session.createCriteria(BusiOrderEntity.class);  
		if(null != req.getOrder_no())
		{
			cri.add(Restrictions.eq("orderNo", req.getOrder_no()));  
		}
		if(null != req.getBusi_type())
		{
			cri.add(Restrictions.eq("busiType", Integer.parseInt(req.getBusi_type())));  
		}
		if(null != req.getPayType())
		{
			cri.add(Restrictions.eq("payType", req.getPayType()));  
		}
		@SuppressWarnings("unchecked")
		List<BusiOrderEntity> list = cri.list();  
		
		if(list.isEmpty())
		{
			logger.error("getBusiOrderInfo end list is empty");
			return null;
		}
		else
		{
			return list.get(0);
		}
	}
	
	/**
	 * @author smart迅
	 *根据exorder_num  查询支付域数据
	 * @param exorder_num
	 * @return
	 */
	public PlatOrderEntity getEntityByExordNo(String exorder_num)
	{
		logger.info("getEntityByExordNo start exorder_num= "+exorder_num);
		Session session = entityManager.unwrap(org.hibernate.Session.class);  
		Criteria cri = session.createCriteria(PlatOrderEntity.class);  
		cri.add(Restrictions.eq("exorderNum", exorder_num));  
		@SuppressWarnings("unchecked")
		List<PlatOrderEntity> list = cri.list();  
		
		if(list.isEmpty())
		{
			logger.error("getEntityByExordNo end list is empty");
			return null;
		}
		else
		{
			return list.get(0);
		}
	}
	
	/**
	 * @author smart迅
	 *根据平台订单号查询客户端发起请求时的订单号
	 * @param orderNo
	 * @return
	 */
	public String getBusiOrderByExtordNo(String orderNo)
	{
		logger.info("getBusiOrderByExtordNo start orderNo ="+orderNo);
		Session session = entityManager.unwrap(org.hibernate.Session.class);  
		String sql = "SELECT order_no FROM `t_busiorder` WHERE id = (SELECT id FROM `t_platorder` WHERE exorder_num = ?)";
    	SQLQuery query = session.createSQLQuery(sql);  
    	query.setParameter(0, orderNo);
    	@SuppressWarnings("unchecked")
		List<String> returnList = query.list();
    	if(returnList.isEmpty())
    	{
    		logger.error("getBusiOrderByExtordNo end list is empty");
    		return null;
    	}
    	else
    	{
    		return returnList.get(0);
    	}
	}
	/**
	 * @author smart迅
	 *根据订单号查询返回 url
	 * @param orderNo
	 * @return
	 */
	public String getBusiUrlByExtordNo(String orderNo)
	{
		logger.info("getBusiUrlByExtordNo start orderNo ="+orderNo);
		Session session = entityManager.unwrap(org.hibernate.Session.class);  
		String sql = "SELECT return_url FROM `t_busiorder` WHERE id = (SELECT id FROM `t_platorder` WHERE exorder_num = ?)";
		SQLQuery query = session.createSQLQuery(sql);  
		query.setParameter(0, orderNo);
		@SuppressWarnings("unchecked")
		List<String> returnList = query.list();
		if(returnList.isEmpty())
		{
			logger.error("getBusiOrderByExtordNo end list is empty");
			return null;
		}
		else
		{
			return returnList.get(0);
		}
	}
	
	
}
