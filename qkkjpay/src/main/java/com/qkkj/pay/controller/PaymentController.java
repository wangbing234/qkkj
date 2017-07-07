package com.qkkj.pay.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.qkkj.pay.common.aspect.LoggerAspect;
import com.qkkj.pay.common.constants.Constants;
import com.qkkj.pay.common.exception.BusinessException;
import com.qkkj.pay.common.utils.ImageUtils;
import com.qkkj.pay.common.utils.SignatureEncryption;
import com.qkkj.pay.domain.common.BaseResult;
import com.qkkj.pay.domain.common.CommonEnum;
import com.qkkj.pay.domain.req.PayReturnAsyiReq;
import com.qkkj.pay.domain.req.PaymentReq;
import com.qkkj.pay.domain.req.PaymentReturnReq;
import com.qkkj.pay.domain.req.QueryOrderInfoReq;
import com.qkkj.pay.domain.rsp.GetWorkKeyRsp;
import com.qkkj.pay.domain.rsp.ScanPayRsp;
import com.qkkj.pay.domain.rsp.WebPayRsp;
import com.qkkj.pay.service.impl.PaymentServiceImpl;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController 
{
	@Autowired
	private PaymentServiceImpl paymentService;
	
	private final static Logger logger = LoggerFactory.
			getLogger(LoggerAspect.class);

	/**
	 * 根据appId,appsecret获取workKey
	 * @return
	 */
	//@GetMapping(value = "/getkey")	 
    public GetWorkKeyRsp getWorkKey() 
	{			
		GetWorkKeyRsp rsp = new GetWorkKeyRsp();
		
		String result=paymentService.getWorkKey();
		if(null == result)
		{
			rsp.setKey(null);
			rsp.setCode(Constants.FAIL);
			rsp.setMsg("get work key error");
		}
		else
		{
			rsp.setKey(result);
			rsp.setCode(Constants.SUCCESS);
			rsp.setMsg("success");
		}
		
		return rsp;
    }
	
	/**
	 * 查询订单状态接口
	 * @return
	 */
	@RequestMapping(value = "/getorderinfo",
			method=RequestMethod.POST,
			consumes = "application/json")
	public BaseResult getOrderInfo(@RequestBody @Valid QueryOrderInfoReq req,BindingResult bindResult)
	{
		BaseResult baseResult = new BaseResult();
		if(bindResult.hasErrors())
		{
			baseResult.setCode(CommonEnum.FAIL.getRetCode());
			baseResult.setMsg(bindResult.getFieldError().getDefaultMessage());
			logger.error("error input :"+baseResult.getMsg());
		}
		else
		{
			baseResult = paymentService.getBusiOrderInfo(req);
		}
		return baseResult;
	}
	
	/**
	 * 网页支付接口
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value = "/webpay",
			method=RequestMethod.POST,
			consumes = "application/json")
	public WebPayRsp webPay(@RequestBody @Valid PaymentReq req,
			BindingResult checkResult)
	{
		WebPayRsp rsp = new WebPayRsp();
		if(checkResult.hasErrors())
		{
			rsp.setCode(CommonEnum.FAIL.getRetCode());
			rsp.setMsg(checkResult.getFieldError().getDefaultMessage());
			logger.error("input error "+rsp.getMsg());
			return rsp;
		}
		
		try
		{
			rsp = paymentService.doWebPay(req);
		}
		catch(BusinessException e)
		{
			logger.error("exception e"+e.getMessage());
			rsp.setCode(e.getErrorCode());
			rsp.setMsg(e.getMessage());
		}
			return rsp;
	}
	/**
	 * 订单支付成功，统一平台回调异步接口
	 * @param req
	 * @return
	 */
	@PostMapping(value="/payreturn",consumes = "application/json")
	public String payReturn(@RequestBody PaymentReturnReq req)
	{
		logger.debug("PaymentController -> payReturn req={}",req);
		BaseResult result = new BaseResult();
		paymentService.getWorkKey();
		if(Constants.PAYSUCCESS.equals(req.getSuccess()))
		{
			String amount = paymentService.getAmountByOrderNo(req.getData().getOrder_no());
			
			Map<String, String> signArr = new HashMap<String, String>();
			signArr.put("success", req.getSuccess());
			//String orderNo = System.currentTimeMillis()+RandomCodeUtils.getRandomNumString(6);
			signArr.put("app_id", Constants.APPID);
			signArr.put("order_no", req.getData().getOrder_no());
			signArr.put("amount",amount);
			signArr.put("workkey", paymentService.getWorkKey());
			
			String sign = SignatureEncryption.buildReturnSign(signArr);
			if(!sign.equals(req.getData().getSign()))
			{
				//签名不安全
				logger.error("PaymentController -> paymentService payReturn error .sign not safe");
				return Constants.PAYFAILEDRETURN;
			}
			
			//1.存回调参数
			//2/修改订单表状态值
			try 
			{
				result = paymentService.payReturn(req);
			} 
			catch (BusinessException e) 
			{
				logger.error("PaymentController -> paymentService payReturn exception e={}",e.getMessage());
				result.setMsg(Constants.PAYFAILEDRETURN);
			}
			logger.debug("PaymentController -> payReturn end");
			return result.getMsg();
		}
		else
		{
			logger.error("PaymentController -> payReturn failed");
			return Constants.PAYFAILEDRETURN;
		}
	}
	
	/**
	 * @author smart迅
	 *支付成功同步回调方法
	 */
	@GetMapping(value="/payreturnasyi")
	public void payReturnAsyi(HttpServletResponse response,PayReturnAsyiReq req)
	{
		try 
		{
			String redirectUrl = paymentService.getWebPayReturnUrl(req.getOut_trade_no());
			response.sendRedirect(redirectUrl);
		} catch (IOException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	/**
	 * @author smart迅
	 *支付宝扫码支付
	 * @param req
	 * @param checkResult
	 * @return
	 */
	@PostMapping(value="/scanpay",consumes = "application/json")
	public ScanPayRsp scanPay(@RequestBody @Valid PaymentReq req,
			BindingResult checkResult)
	{
		ScanPayRsp rsp = new ScanPayRsp();
		if(checkResult.hasErrors())
		{
			rsp.setRetcode(CommonEnum.FAIL.getRetCode());
			rsp.setRetmsg(checkResult.getFieldError().getDefaultMessage());
			logger.error("input error "+rsp.getRetmsg());
			return rsp;
		}
		try
		{
			rsp = paymentService.doScanPay(req);
			
		}
		catch(BusinessException e)
		{
				logger.error("exception e"+e.getMessage());
				rsp.setRetcode(e.getErrorCode());
				rsp.setRetmsg(e.getMessage());
		}
		
		if(rsp.getRetcode().equals(CommonEnum.SUCCESS.getRetCode()))
		{
			ImageUtils imageUtil = new ImageUtils();
			String filePath = imageUtil.createQrcode(rsp.getRetsign());
			if(null == filePath)
			{
				logger.error("createQrcode failed filePath is null");
				rsp.setRetcode(CommonEnum.FAIL.getRetCode());
				rsp.setRetmsg(CommonEnum.FAIL.getRetMsg());
			}
			else
			{
				logger.info("image path "+filePath);
				ImageUtils imageUtils = new ImageUtils();
				String res = imageUtils.GetImageStr(filePath);
				logger.info("res :"+res);
				rsp.setRetsign(res);
				rsp.setRetcode(CommonEnum.SUCCESS.getRetCode());
				rsp.setRetmsg(CommonEnum.SUCCESS.getRetMsg());
			}
		}
		else
		{
				logger.error("do scan pay failed ");
		}
		
		return rsp;
	}
	

}
