package com.qkkj.pay.domain.common;

public class BaseResult 
{
	private String code;
	
	private String msg;
	
	public String getCode() {
		return code;
	}
	
	public BaseResult(){}
	
	public BaseResult(String retCode, String retMsg) 
	{
		
		this.code = retCode;
		this.msg = retMsg;
	}
	public void setCode(String retCode) {
		this.code = retCode;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String retMsg) {
		this.msg = retMsg;
	}

	@Override
	public String toString() {
		return "BaseResult [retCode=" + code + ", retMsg=" + msg + "]";
	}
	
}
