package com.qkkj.pay.domain.common;

import com.qkkj.pay.common.constants.Constants;

public enum ChannelEnum 
{
	ALIPAY("1","alipay"),
	WEIXIN("2","wepay"),
	UPPAY("3","uppay"),
	WDEPAY("4","wdepay")
	;
	private String channelCode;
	
	private String channelInfo;
	
	private ChannelEnum(String channelCode,String channelInfo) 
	{
		
		this.channelCode = channelCode;
		this.channelInfo = channelInfo;
	}

	public String getChannelCode() {
		return channelCode;
	}

	public void setChannelCode(String channelCode) {
		this.channelCode = channelCode;
	}

	public String getChannelInfo() {
		return channelInfo;
	}

	public void setChannelInfo(String channelInfo) {
		this.channelInfo = channelInfo;
	}

	/**
	 * @author smart迅
	 *根据传参获取支付方式
	 * @param channelCode
	 * @return
	 */
	public static String getChannelInfoByCode(String channelCode)
	{		
		String channelInfo = null;
		switch(channelCode)
		{
		case Constants.ALIPAY:
			channelInfo = ChannelEnum.ALIPAY.channelInfo;
			break;
		case Constants.WEIXIN:
			channelInfo = ChannelEnum.WEIXIN.channelInfo;
			break;
		case Constants.UPPAY:
			channelInfo = ChannelEnum.UPPAY.channelInfo;
			break;
		case Constants.WDEPAY:
			channelInfo = ChannelEnum.WDEPAY.channelInfo;
			break;
		default:
			channelInfo = ChannelEnum.ALIPAY.channelInfo;
		}
		return channelInfo;
	}
	
}
