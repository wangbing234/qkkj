package com.qkkj.pay.service.impl;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.qkkj.pay.common.constants.Constants;
import com.qkkj.pay.common.exception.BusinessException;
import com.qkkj.pay.common.httpclient.HttpClientHelp;
import com.qkkj.pay.common.utils.ConfigLoader;
import com.qkkj.pay.common.utils.HttpClient;
import com.qkkj.pay.common.utils.HttpRequestUtils;
import com.qkkj.pay.common.utils.RandomCodeUtils;
import com.qkkj.pay.common.utils.SignatureEncryption;
import com.qkkj.pay.domain.common.BaseResult;
import com.qkkj.pay.domain.common.ChannelEnum;
import com.qkkj.pay.domain.common.CommonEnum;
import com.qkkj.pay.domain.entity.BusiOrderEntity;
import com.qkkj.pay.domain.entity.LinkedPayPlatReqEntity;
import com.qkkj.pay.domain.entity.LinkedPayReturnEntity;
import com.qkkj.pay.domain.entity.PlatOrderEntity;
import com.qkkj.pay.domain.entity.WorkKeyEntity;
import com.qkkj.pay.domain.req.Data;
import com.qkkj.pay.domain.req.PaymentReq;
import com.qkkj.pay.domain.req.PaymentReturnReq;
import com.qkkj.pay.domain.req.QueryBusiOrderReq;
import com.qkkj.pay.domain.req.QueryOrderInfoReq;
import com.qkkj.pay.domain.req.ScanPayReq;
import com.qkkj.pay.domain.rsp.QueryOrderInfoRsp;
import com.qkkj.pay.domain.rsp.SaveBusiOrderEntityRsp;
import com.qkkj.pay.domain.rsp.ScanPayRsp;
import com.qkkj.pay.domain.rsp.WebPayRsp;
import com.qkkj.pay.repo.dao.PaymentDao;
import com.qkkj.pay.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService
{
	private final  Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

	@Autowired
	private PaymentDao paymentDao;
	
	@PersistenceContext  
    EntityManager entityManager; 
	
	/**
	 * @author smart迅
	 *保存统一支付平台支付后回调
	 * @param req
	 * @return
	 * @throws Exception 
	 */
	@Override
	@Transactional
	public BaseResult payReturn(PaymentReturnReq req ) throws BusinessException 
	{
		logger.info("PaymentServiceImpl ->payReturn start.req={}",req);
		BaseResult  result = new BaseResult(
				CommonEnum.SUCCESS.getRetCode(),CommonEnum.SUCCESS.getRetMsg());
	
		//1.添加一条记录在返回表
		LinkedPayReturnEntity payEntity = new LinkedPayReturnEntity();
		BeanUtils.copyProperties(req, payEntity);
		Data data = req.getData();
		if(null != req.getData())
		{
			buildPayReturnEntity(payEntity, data);
		}
		
		payEntity.setCreate_time(new Timestamp(System.currentTimeMillis()));
		logger.info("PaymentServiceImpl ->payReturn linkedPayReturnEntity={}",payEntity.toString());
		
		Session session = entityManager.unwrap(org.hibernate.Session.class);  
		if(null == paymentDao.addLinkedPayReturnRepository(session,payEntity))
		{
			logger.error("PaymentServiceImpl ->payReturn error.save LinkedPayReturnRepository error");
			throw new BusinessException(
					CommonEnum.ADD_LINKEDPAYRETURN_FAILED.getRetCode(),CommonEnum.ADD_LINKEDPAYRETURN_FAILED.getRetMsg());
		}
		//更新客户端支付请求记录状态
		if(0 == paymentDao.updatebusiOrderStatues(session,req))
		{
			logger.error("PaymentServiceImpl ->payReturn updatebusiOrderStatues error ");
			throw new BusinessException(
					CommonEnum.UPDATEBUSIORDERFAILED.getRetCode(),CommonEnum.UPDATEBUSIORDERFAILED.getRetMsg());
		}
		//更新支付域订单记录状态
		if(0 == paymentDao.updatePlatOrder(session,req))
		{
			logger.error("PaymentServiceImpl ->payReturn updatePlatOrder error ");
			throw new BusinessException(
					CommonEnum.UPDATEPLATORDERFAILED.getRetCode(),CommonEnum.UPDATEPLATORDERFAILED.getRetMsg());
		}
		//TODO 调客户接口
		//查询客户端请求订单号
		String busiOrder = paymentDao.getBusiOrderByExtordNo(data.getOrder_no());
		logger.info("PaymentServiceImpl ->payReturn  busiOrder ="+busiOrder);
		if(null == busiOrder)
		{
			logger.error("PaymentServiceImpl ->payReturn getBusiOrderByExtordNo return null");
			throw new BusinessException(
					CommonEnum.GETBUSIORDERFAILED.getRetCode(),CommonEnum.GETBUSIORDERFAILED.getRetMsg());
		}
		
		String url = ConfigLoader.getInstance().getProperty("RETURN_URL");
		//String url = "http://192.168.65.1:9999/shop/order/returnOrders.html?rp.orderNo=1&rp.amount=1&rp.status=1&rp.sign=1";
		HttpClient httpClient = new HttpClient();
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("rp.amount", data.getAmount());
		params.put("rp.orderNo", busiOrder);
		params.put("rp.status", req.getSuccess());		
		
		params.put("rp.sign",SignatureEncryption.encodeSign(busiOrder, data.getAmount(), req.getSuccess()));
		
		String strResult = httpClient.sendPostRequestMap(url, params);
		logger.info("busi rsp = "+strResult);
		
		logger.info("PaymentServiceImpl ->payReturn end.result={}",result);
		return result;
	}

	/**
	 * @param payEntity
	 * @param data
	 */
	private void buildPayReturnEntity(LinkedPayReturnEntity payEntity, Data data) 
	{
		payEntity.setAmount(data.getAmount());
		payEntity.setApp_id(data.getApp_id());
		payEntity.setChannel(data.getChannel());
		payEntity.setDescription(data.getDescription());
		payEntity.setOrder_no(data.getOrder_no());
		payEntity.setPaytype(data.getPaytype());
		payEntity.setSign(data.getSign());
		payEntity.setSubmerno(data.getSubmerno());
		payEntity.setTimestamp(data.getTimestamp());
		payEntity.setTransaction_id(data.getTransaction_id());
	}

	/* 
	 * 获取workKey
	 */
	@Override
	public String getWorkKey() 
	{
		long currentTimeMillis = System.currentTimeMillis();
		// 如果数据存在，则开始比较上次获得workkey的时间
		Date date = new Date(currentTimeMillis);
		SimpleDateFormat formatter = new SimpleDateFormat(Constants.DATAFORMATYMD);
		String today = formatter.format(date);
		
		WorkKeyEntity entity = paymentDao.getWorkKeyEntityByDay(today);
		//查询对象不为空且日期与今天相等
		if(null != entity && 
				StringUtils.endsWithIgnoreCase(today, entity.getDay()))
		{
			return entity.getSignkey();
		}
		else
		{
			JSONObject param = new JSONObject();
			param.put("appid", Constants.APPID);
			param.put("appsecret", Constants.AppSecret);
			logger.info("WdepayInterfaceUtils->GetWorkKey param :" + param.toJSONString());

			// 获取统一收银台工作密钥URL
			String reqURL = Constants.Get_Wpay_workKey_url;
			// 发起POST请求
			String respJsonStr = HttpClientHelp.sendStrEntityByPost(param.toString(), reqURL, null);
			JSONObject result = JSONObject.parseObject(respJsonStr);
			logger.info("WdepayInterfaceUtils->GetWorkKey respJsonStr :" + respJsonStr );

			if (result.getString("retcode").equals("succ")) 
			{
				WorkKeyEntity workEntity = new WorkKeyEntity();
				workEntity.setSignkey(result.getString("key"));
				workEntity.setDay(today);
				
				workEntity.setCreateTime(new Timestamp(currentTimeMillis));	
				paymentDao.addWorkKeyRepository(workEntity);
				return result.getString("key");
			}
			else
			{
				return null;
			}
		}
	}
	
	/**
	 * @author smart迅
	 * 2.存网页支付的入参 
	 * @param req
	 * @return
	 */
	public SaveBusiOrderEntityRsp webPaySaveBusiReq(PaymentReq req)
	{
		logger.debug("PaymentServiceImpl -> webPay addBudiOrderEntity start req={}",req);
		SaveBusiOrderEntityRsp  result = new SaveBusiOrderEntityRsp();
		Timestamp now = new Timestamp(System.currentTimeMillis());
		
		//根据商户类型和订单号 先检查是否重复提交
		QueryBusiOrderReq queryBusiOrderReq = new QueryBusiOrderReq();
		queryBusiOrderReq.setBusi_type(req.getBusiType());
		queryBusiOrderReq.setOrder_no(req.getOrder_no());
		BusiOrderEntity exitEntity = paymentDao.getBusiOrderInfo(queryBusiOrderReq);
		
		//存在数据
		if(null != exitEntity)
		{
			logger.info("webPaySaveBusiReq BusiOrderEntity exit ");
			result.setBusiOrderEntity(exitEntity);
			result.setCode(CommonEnum.BUSIORDEREXIT.getRetCode());
			result.setMsg(CommonEnum.BUSIORDEREXIT.getRetMsg());
			return result;
		}
		else
		{
			BusiOrderEntity busiOrderEntity = new BusiOrderEntity();
			busiOrderEntity.setAmount(Integer.parseInt(req.getAmount()));
			busiOrderEntity.setBusiType(Integer.parseInt(req.getBusiType()));
			busiOrderEntity.setChanel(Integer.parseInt(req.getChannel()));
			//初始状态为待支付
			busiOrderEntity.setStatues(1);
			busiOrderEntity.setOrderNo(req.getOrder_no());
			busiOrderEntity.setReturnUrl(req.getReturnUrl());
			busiOrderEntity.setCreateTime(now);
			busiOrderEntity.setUpdateTime(now);
			
			if(null == paymentDao.addBusiOrderEntity(busiOrderEntity))
			{
				logger.error("PaymentServiceImpl -> webPay addBudiOrderEntity error ");
				result.setCode(CommonEnum.ADD_BUSIORDER_FAILED.getRetCode());
				result.setMsg(CommonEnum.ADD_BUSIORDER_FAILED.getRetMsg());
				result.setBusiOrderEntity(null);
			}
			else
			{
				logger.error("PaymentServiceImpl -> webPay addBudiOrderEntity end ");
				result.setBusiOrderEntity(busiOrderEntity);
				result.setCode(CommonEnum.SUCCESS.getRetCode());
				result.setMsg(CommonEnum.SUCCESS.getRetMsg());
			}
		}
		logger.debug("PaymentServiceImpl -> webPay addBudiOrderEntity end ");
		return result;
	}

	/**
	 * @author smart迅
	 *保存支付域所需记录的数据
	 * @param param
	 * @return
	 */
	private BaseResult webPaySavePlatReq(PaymentReq req ,JSONObject param) 
	{
		logger.debug("PaymentServiceImpl -> webPay webPaySavePlatReq start param={}",param);

		BaseResult rsp = new BaseResult();
		
		PlatOrderEntity payPlatReqEntity = new PlatOrderEntity();
		
		payPlatReqEntity.setAmount(Integer.parseInt(param.getString("amount")));
		payPlatReqEntity.setAppId(Constants.APPID);
		payPlatReqEntity.setBusiType(Integer.parseInt(req.getBusiType()));
		payPlatReqEntity.setChanel(Integer.parseInt(req.getChannel()));
		//TODO
		payPlatReqEntity.setExorderNum(param.getString("order_no"));
		payPlatReqEntity.setStatues(1);
		Timestamp now = new Timestamp(System.currentTimeMillis());
		payPlatReqEntity.setCreateTime(now);
		payPlatReqEntity.setUpdateTime(now);
		
		if(null == paymentDao.addPayPlatReqEntity(payPlatReqEntity))
		{
			logger.error("PaymentServiceImpl -> webPay webPaySavePlatReq error.");
			rsp.setCode(CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetCode());
			rsp.setMsg(CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetMsg());
		}
		else
		{
			logger.info("PaymentServiceImpl -> webPay webPaySavePlatReq success.");
			rsp.setCode(CommonEnum.SUCCESS.getRetCode());
			rsp.setMsg(CommonEnum.SUCCESS.getRetMsg());
			
		}
		logger.debug("PaymentServiceImpl -> webPay webPaySavePlatReq end. rsp={}",rsp);

		return rsp;
	}

	/**
	 * @author smart迅
	 *保存“统一支付平台”所需数据
	 * @param param
	 * @return
	 */
	private BaseResult webPaySaveLinkedPayReq(PaymentReq req ,JSONObject param) 
	{
		logger.debug("PaymentServiceImpl -> webPay webPaySaveLinkedPayReq start. param={}",param);
		BaseResult  result = new BaseResult(
				CommonEnum.SUCCESS.getRetCode(),CommonEnum.SUCCESS.getRetMsg());
		
		LinkedPayPlatReqEntity payPlatReqEntity = new LinkedPayPlatReqEntity();
		payPlatReqEntity.setAmount(Integer.parseInt(param.getString("amount")));
		payPlatReqEntity.setAppId(Constants.APPID);
		payPlatReqEntity.setBody(null);
		payPlatReqEntity.setChannel(Integer.parseInt(req.getChannel()));
		
		payPlatReqEntity.setDescription(null);
		payPlatReqEntity.setNonce(RandomCodeUtils.getRandomNumString(32));
		payPlatReqEntity.setOrderNo(param.getString("order_no"));
		
		payPlatReqEntity.setSign(param.getString("sign"));
		payPlatReqEntity.setSubject(param.getString("order_no"));
		payPlatReqEntity.setSubmerNo(param.getString("busiType"));
		Timestamp now = new Timestamp(System.currentTimeMillis());
		payPlatReqEntity.setCreateTime(now);
		payPlatReqEntity.setPayTimestamp(now.toString());
		
		if(null == paymentDao.addLinkedPayPlatEntity(payPlatReqEntity))
		{
			logger.error("PaymentServiceImpl -> webPay save webPaySaveLinkedPayReq error.");
			result.setCode(CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetCode());
			result.setMsg(CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetMsg());
		}
		return result;
	}

	/**
	 * @author smart迅
	 *根据商户类型和订单号查询订单状态
	 * @param req
	 * @return
	 */
	@Override
	public QueryOrderInfoRsp getBusiOrderInfo(QueryOrderInfoReq req) 
	{
		logger.debug("paymentserviceimpl -> getBusiOrderInfo start. req={}",req);
		QueryOrderInfoRsp result = new QueryOrderInfoRsp();
		QueryBusiOrderReq queryReq = new QueryBusiOrderReq();
		queryReq.setBusi_type(req.getBusi_type());
		queryReq.setOrder_no(req.getBusi_type());
		BusiOrderEntity busiOrderEntity = paymentDao.getBusiOrderInfo(queryReq);
		//String statues = paymentDao.getBusiOrderInfo(req);
		if(null == busiOrderEntity)
		{
			logger.error("paymentserviceimpl -> getBusiOrderInfo error. entity not found");
			result.setCode(CommonEnum.ORDERISNULL.getRetCode());
			result.setMsg(CommonEnum.ORDERISNULL.getRetMsg());
		}
		else
		{
			result.setCode(CommonEnum.SUCCESS.getRetCode());
			result.setMsg(CommonEnum.SUCCESS.getRetMsg());
			result.setStatues(String.valueOf(busiOrderEntity.getStatues()));
			result.setUpdateTime(busiOrderEntity.getUpdateTime().toString());
		}
		logger.debug("paymentserviceimpl -> getBusiOrderInfo end. result={}",result);
		return result;
	}

	/**
	 * @author smart迅
	 *根据订单号查询金额
	 * @param orderNo
	 * @return
	 */
	@Override
	public String getAmountByOrderNo(String orderNo) 
	{
		PlatOrderEntity platOrderEntity =  paymentDao.getEntityByExordNo(orderNo);
		if(null == platOrderEntity)
		{
			logger.info("paymentserviceimpl ->getAmountByOrderNo end entity is null.");
			return null;
		}
		return String.valueOf(platOrderEntity.getAmount());
	}

	/**
	 * @author smart迅
	 *校验返回的html里面金额与发起请求的金额是否一致
	 * @param htmlStr
	 * @param amount
	 * @return
	 */
	/*private boolean checkAmount(String htmlStr, String amount) 
	{
		logger.info("paymentserviceimpl ->checkAmount start ");
		logger.info(htmlStr);
		boolean result = false;
		int inputAmount = Integer.parseInt(amount);
		try
		{
			int startIndex = htmlStr.indexOf("{");
			int endIndex = htmlStr.lastIndexOf("}");
			String strCut = htmlStr.substring(startIndex,endIndex+1);
		
			String strReplace = strCut.replaceAll("&quot;", "\"");
		
			JSONObject param = JSONObject.parseObject(strReplace);
			String returnAmountStr = param.getString("total_amount");
			String str = null;
			int backAmountInt = 0;
			if(returnAmountStr.contains("."))
			{
				str = returnAmountStr.substring(0, returnAmountStr.indexOf(".")) + returnAmountStr.substring(returnAmountStr.indexOf(".") + 1);
				backAmountInt = Integer.parseInt(str);
			}
			else
			{
				backAmountInt = Integer.parseInt(returnAmountStr)*100;
			}
			 
			logger.info("paymentserviceimpl ->checkAmount start.inputAmount: "+inputAmount+", returnAmount"+backAmountInt);
			//判断两个int类型数据是否相等
			result = backAmountInt==inputAmount;
		
		}
			catch(Exception e)
		{
			logger.error("paymentserviceimpl ->checkAmount error"+e.getMessage());
			result = false;
		}
			logger.info("paymentserviceimpl ->checkAmount end result :" +result);
			return result;
	}*/

	/**
	 * @author smart迅
	 *执行网页支付
	 * @param req
	 * @return
	 * @throws BusinessException
	 */
	@Override
	@Transactional
	public WebPayRsp doWebPay (PaymentReq req) throws BusinessException
	{
		WebPayRsp rsp = new WebPayRsp();
		//网页支付必须要有回调
		if(null == req.getReturnUrl())
		{
			logger.error("web pay return url is null");
			rsp.setCode(CommonEnum.WEBPAYERROR.getRetCode());
			rsp.setMsg(CommonEnum.WEBPAYERROR.getRetMsg());
			return rsp;
					
		}
		
		//1.保存客户端请求原始数据
		SaveBusiOrderEntityRsp SaveBusiOrderEntityRsp = this.webPaySaveBusiReq(req);
		Session session = entityManager.unwrap(org.hibernate.Session.class);  

		if(CommonEnum.SUCCESS.getRetCode().equals(SaveBusiOrderEntityRsp.getCode()))
		{
			String timeStamp = System.currentTimeMillis()+"";

			JSONObject param = buildParam(req,timeStamp);
		
			//2.存支付域封装的数据 
			BaseResult serviceResult = new BaseResult();
			serviceResult = this.webPaySavePlatReq(req,param);
		
			if(CommonEnum.SUCCESS.getRetCode().equals(
							serviceResult.getCode()))
			{
				//3.存当前接入的平台所需支付的请求体
				serviceResult = this.webPaySaveLinkedPayReq(req,param);

				if(CommonEnum.SUCCESS.getRetCode().equals(
					serviceResult.getCode()))
				{
					param.put("subject", req.getOrder_no());
					param.put("submerno", Constants.APPID);
					param.put("appid", Constants.APPID);
					param.put("timestamp", timeStamp);
					param.put("body", null);
					param.put("description", null);
					param.put("nonce", RandomCodeUtils.getRandomNumString(32));
			
					String dopayUrl = Constants.url_doWebpay;
					String result = HttpRequestUtils.buildJsonParamsRequest(dopayUrl, param);
					
					//WebPayRsp webPayRsp  = JSON.parseObject(result, WebPayRsp.class);

					/*boolean checkAmountResult = this.checkAmount(result,req.getAmount());
					if(!checkAmountResult)
						{
							logger.error("paymentController->webpay() error ,amount error");
							throw new BusinessException(
									CommonEnum.HTMLAMOUNTCHECKERROR.getRetCode(),CommonEnum.HTMLAMOUNTCHECKERROR.getRetMsg());
						}*/
					paymentDao.updatebusiOrderHtmlStr(session,result,req);
					rsp.setCode(CommonEnum.SUCCESS.getRetCode());
					rsp.setMsg(CommonEnum.SUCCESS.getRetMsg());
					rsp.setData(result);						
				}
				else
				{
					logger.error("paymentController->webpay() error , add platOrder error");
					throw new BusinessException(
							CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetCode(),CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetMsg());
		
				}
			}
			else
			{
				logger.error("paymentController->webpay() error , add platOrder error");
				throw new BusinessException(
						CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetCode(),CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetMsg());
			}
	}
		//客户发起的请求已存
		else if(CommonEnum.BUSIORDEREXIT.getRetCode().
				equals(SaveBusiOrderEntityRsp.getCode()))
		{
			BusiOrderEntity busiOrderEntity = SaveBusiOrderEntityRsp.getBusiOrderEntity();
			if(2 == busiOrderEntity.getStatues())
			{
				logger.info("busi ordre exit and pay success");
				rsp.setCode(CommonEnum.BUSIORDEREXITPAYEDS.getRetCode());
				rsp.setMsg(CommonEnum.BUSIORDEREXITPAYEDS.getRetMsg());
				return rsp;
			}
			else
			{
				WebPayRsp webPayRsp = this.paySecondTimes(busiOrderEntity,req,session);
				if(webPayRsp.getCode().equals(CommonEnum.SUCCESS.getRetCode()))
				{
					logger.info("paySecondTimes update data success");
					return webPayRsp;
				}
				else
				{
					logger.info("paySecondTimes update data error");
					throw new BusinessException(webPayRsp.getCode(),webPayRsp.getMsg());
				}
			}
		}
		else 
		{
			logger.error("web pay return url is null");
			throw new BusinessException(rsp.getCode(),rsp.getMsg());
		}
		logger.info("do webpay end rsp={}",rsp);
		return rsp;
	
	}

	/**
	 * @author smart迅
	 *构建param
	 * @param req
	 * @param timeStamp
	 * @return
	 */
	private JSONObject buildParam(PaymentReq req,String timeStamp) 
	{
		logger.info("buildParam start req={}",req);
		// 把请求参数打包成json
		JSONObject param = new JSONObject();	
		param.put("amount", req.getAmount());
		String chennel = ChannelEnum.getChannelInfoByCode(String.valueOf(req.getChannel()));
		param.put("channel", chennel);

		Map<String, String> signArr = new HashMap<String, String>();
		signArr.put("appid", Constants.APPID);
		String orderNo = System.currentTimeMillis()+RandomCodeUtils.getRandomNumString(6);
		signArr.put("order_no", orderNo);
		signArr.put("amount", req.getAmount());
		signArr.put("timestamp",timeStamp);
		signArr.put("unlockingkey", this.getWorkKey());

		param.put("order_no", orderNo);
		//请求的地址 URL
		String sign = SignatureEncryption.buildRequestSign(signArr);
		logger.debug("sign={}",sign);
		param.put("sign", sign);
		
		logger.info("buildParam end param={}",param);
		return param;
	}
	
	/**
	 * @author smart迅
	 *二次支付，更新之前数据
	 * @return
	 */
	private WebPayRsp paySecondTimes(BusiOrderEntity busiOrderEntity,PaymentReq req,Session session)
	{
		logger.info("paySecondTimes start");
		WebPayRsp rsp = new WebPayRsp();
		
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String timeStamp = System.currentTimeMillis()+"";

		JSONObject param = buildParam(req,timeStamp);
		param.put("subject", req.getOrder_no());
		param.put("submerno", Constants.APPID);
		param.put("appid", Constants.APPID);
		param.put("timestamp", timeStamp);
		param.put("body", null);
		param.put("description", null);
		param.put("nonce", RandomCodeUtils.getRandomNumString(32));

		String dopayUrl = Constants.url_doWebpay;
		String payUrl = HttpRequestUtils.
		buildJsonParamsRequest(dopayUrl, param);
		
		busiOrderEntity.setHtmlStr(payUrl);
		busiOrderEntity.setReturnUrl(req.getReturnUrl());
		busiOrderEntity.setUpdateTime(time);
		String id = String.valueOf(busiOrderEntity.getID());
		String orderNo = param.getString("order_no");
		//1.更新busi
		int  updatebusiResult = paymentDao.updatebusiOrder(session, busiOrderEntity);
		//2.更新plat
		int updatePlatOrderResult = paymentDao.updatePlatOrder(session,id,time,orderNo);
		//3.更新req
		int updateLinkPayReqResult = paymentDao.updateLinkPayReq(session, id,time,orderNo);
		
		if(1 == updatebusiResult*updatePlatOrderResult*updateLinkPayReqResult)
		{
			logger.info("update data success");
			rsp.setCode(CommonEnum.SUCCESS.getRetCode());
			rsp.setMsg(CommonEnum.SUCCESS.getRetMsg());
			rsp.setData(payUrl);
		}
		else
		{
			logger.info("update data failed");
			rsp.setCode(CommonEnum.FAIL.getRetCode());
			rsp.setMsg(CommonEnum.FAIL.getRetMsg());
			rsp.setData("result = "+updatebusiResult+updatePlatOrderResult+updateLinkPayReqResult);
		}
		
		return rsp;
		
	}
	
	/**
	 * @author smart迅
	 *首次扫码付
	 * @param req
	 * @return
	 * @throws BusinessException
	 */
	@Override
	@Transactional
	public ScanPayRsp doScanPay(PaymentReq req) throws BusinessException
	{
		logger.info("doScanPay start req={}",req);
		ScanPayRsp scanPayRsp = new ScanPayRsp();
		String timeStamp = System.currentTimeMillis()+"";
		Session session = entityManager.unwrap(org.hibernate.Session.class);  

		//1.保存客户端请求原始数据
		SaveBusiOrderEntityRsp SaveBusiOrderEntityRsp = this.webPaySaveBusiReq(req);

		if(CommonEnum.SUCCESS.getRetCode().equals(SaveBusiOrderEntityRsp.getCode()))
		{

			JSONObject param = buildParam(req,timeStamp);
				
			//2.存支付域封装的数据 
			BaseResult serviceResult = new BaseResult();
			serviceResult = this.webPaySavePlatReq(req,param);
				
			if(CommonEnum.SUCCESS.getRetCode().equals(
									serviceResult.getCode()))
			{
				//3.存当前接入的平台所需支付的请求体
				serviceResult = this.webPaySaveLinkedPayReq(req,param);

				if(CommonEnum.SUCCESS.getRetCode().equals(
						serviceResult.getCode()))
				{
					ScanPayReq scanPayReq = new ScanPayReq();
					scanPayReq.setAmount(req.getAmount());
					scanPayReq.setAppid(Constants.APPID);
					scanPayReq.setBody(null);

					scanPayReq.setChannel(param.getString("channel"));
					scanPayReq.setDescription(null);
					scanPayReq.setNonce(RandomCodeUtils.getRandomNumString(32));
					scanPayReq.setOrder_no(param.getString("order_no"));
				
					scanPayReq.setSign(param.getString("sign"));
					
					scanPayReq.setPaytype("scancd");
					scanPayReq.setSubject(req.getOrder_no());
					scanPayReq.setSubmerno(Constants.APPID);
					scanPayReq.setTimestamp(timeStamp);
					
					String reqURL = Constants.url_scanpay;
					String respJsonStr = HttpClientHelp.sendStrEntityByPost(JSONObject.toJSONString(scanPayReq), reqURL, null);
					logger.info("rsp str  "+respJsonStr);
					scanPayRsp = JSON.parseObject(respJsonStr, ScanPayRsp.class);
					if(!scanPayRsp.getRetcode().equals("succ"))
					{
						logger.error("ScanPay failed scanPayRsp={}",scanPayRsp);
						throw new BusinessException(
								scanPayRsp.getRetcode(),scanPayRsp.getRetmsg());
					}
					paymentDao.updatebusiOrderHtmlStr(session,scanPayRsp.getRetsign(),req);
					scanPayRsp.setRetcode(CommonEnum.SUCCESS.getRetCode());
					scanPayRsp.setRetmsg(CommonEnum.SUCCESS.getRetMsg());
										
				}
				else
				{
					logger.error("paymentController->webpay() error , add platOrder error");
					throw new BusinessException(
							CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetCode(),CommonEnum.ADD_LINKEDPAYREQ_FAILED.getRetMsg());
				}
			}
			else
			{
				logger.error("paymentController->webpay() error , add platOrder error");
				throw new BusinessException(
								CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetCode(),CommonEnum.ADD_PAYPLATREQDATA_FAILED.getRetMsg());
			}
		}
		//客户发起的请求已存
		else if(CommonEnum.BUSIORDEREXIT.getRetCode().
					equals(SaveBusiOrderEntityRsp.getCode()))
		{
			BusiOrderEntity busiOrderEntity = SaveBusiOrderEntityRsp.getBusiOrderEntity();
			if(2 == busiOrderEntity.getStatues())
			{
				logger.info("busi ordre exit and pay success");
				scanPayRsp.setRetcode(CommonEnum.BUSIORDEREXITPAYEDS.getRetCode());
				scanPayRsp.setRetmsg(CommonEnum.BUSIORDEREXITPAYEDS.getRetMsg());
				return scanPayRsp;
			}
			else
			{
				scanPayRsp = this.scanPaySecondTimes(busiOrderEntity,req,session);
				if(scanPayRsp.getRetcode().equals(CommonEnum.SUCCESS.getRetCode()))
				{
					logger.info("paySecondTimes update data success");
					return scanPayRsp;
				}
				else
				{
					logger.info("paySecondTimes update data error");
					throw new BusinessException(scanPayRsp.getRetcode(),scanPayRsp.getRetmsg());
				}
			}
		}
		else 
		{
			logger.error("web pay return url is null");
			throw new BusinessException(scanPayRsp.getRetcode(),scanPayRsp.getRetmsg());
		}
		logger.info("do webpay end rsp={}",scanPayRsp);
		return scanPayRsp;
	}
	
	/**
	 * @author smart迅
	 *二次支付用扫码付
	 * @param busiOrderEntity
	 * @param req
	 * @param session
	 * @return
	 */
	private ScanPayRsp scanPaySecondTimes(BusiOrderEntity busiOrderEntity,PaymentReq req,Session session)
	{

		logger.info("paySecondTimes start");
		ScanPayRsp rsp = new ScanPayRsp();
		
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String timeStamp = System.currentTimeMillis()+"";

		JSONObject param = buildParam(req,timeStamp);

		ScanPayReq scanPayReq = new ScanPayReq();
		scanPayReq.setAmount(req.getAmount());
		scanPayReq.setAppid(Constants.APPID);
		scanPayReq.setBody(null);

		scanPayReq.setChannel(param.getString("channel"));
		scanPayReq.setDescription(null);
		scanPayReq.setNonce(RandomCodeUtils.getRandomNumString(32));
		scanPayReq.setOrder_no(param.getString("order_no"));
	
		scanPayReq.setSign(param.getString("sign"));
		
		scanPayReq.setPaytype("scancd");
		scanPayReq.setSubject(req.getOrder_no());
		scanPayReq.setSubmerno(Constants.APPID);
		scanPayReq.setTimestamp(timeStamp);
		
		String dopayUrl = Constants.url_scanpay;
		String payUrl = HttpClientHelp.sendStrEntityByPost(JSONObject.toJSONString(scanPayReq), dopayUrl, null);

		ScanPayRsp scanPayRsp = JSON.parseObject(payUrl, ScanPayRsp.class);
		
		if(!scanPayRsp.getRetcode().equals("succ"))
		{
			logger.error("ScanPay failed scanPayRsp={}",scanPayRsp);
			rsp.setRetcode(CommonEnum.FAIL.getRetCode());
			rsp.setRetmsg(CommonEnum.FAIL.getRetMsg());
			return rsp;
		}
		
		busiOrderEntity.setHtmlStr(scanPayRsp.getRetsign());
		busiOrderEntity.setReturnUrl(null);
		busiOrderEntity.setUpdateTime(time);
		String id = String.valueOf(busiOrderEntity.getID());
		String orderNo = param.getString("order_no");
		//1.更新busi
		int  updatebusiResult = paymentDao.updatebusiOrder(session, busiOrderEntity);
		//2.更新plat
		int updatePlatOrderResult = paymentDao.updatePlatOrder(session,id,time,orderNo);
		//3.更新req
		int updateLinkPayReqResult = paymentDao.updateLinkPayReq(session, id,time,orderNo);
		int result = updatebusiResult*updatePlatOrderResult*updateLinkPayReqResult;
		if(1 == result)
		{
			logger.info("update data success");
			rsp.setRetcode(CommonEnum.SUCCESS.getRetCode());
			rsp.setRetmsg(CommonEnum.SUCCESS.getRetMsg());
			rsp.setOrder_no(scanPayRsp.getOrder_no());
			rsp.setRetsign(scanPayRsp.getRetsign());
		}
		else
		{
			logger.info("update data failed");
			rsp.setRetcode(CommonEnum.FAIL.getRetCode());
			rsp.setRetmsg(String.valueOf(result));
		}
		
		return rsp;
		
	
		
	}
	/**
	 * @author smart迅
	 *根据订单号查询前台回跳url
	 * @param orderNo
	 * @return
	 */
	@Override
	public String getWebPayReturnUrl(String orderNo) 
	{
		String url = paymentDao.getBusiUrlByExtordNo(orderNo);
		logger.info("return url is "+url);
		return url;
	}
	
}
