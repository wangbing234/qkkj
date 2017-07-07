package com.qkkj.pay.common.exception;

/**
 *
 *
 * 类名称：BusinessException 类描述： 创建人：mzw 创建时间：2015年5月26日 上午9:26:09 修改人：mzw
 * 修改时间：2015年5月26日 上午9:26:09 Modification History:
 * =============================================================================
 * Author Date Description
 * ---------------------------------------------------------------------------
 * =============================================================================
 *
 * @version 1.0.0
 *
 *          业务异常类
 */
public class BusinessException extends RuntimeException {

	private static final long serialVersionUID = 679866499132227803L;

	private String errorCode = null;

	private String errorMessage = null;

	public BusinessException() {
		super();
	}

	public BusinessException(String errorCode) {
		this.errorCode = errorCode;
	}

	public BusinessException(String errorCode, String errorMessage) {
		super(errorMessage);
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public BusinessException(String errorCode, String errorMessage, Throwable cause) {
		super(errorMessage, cause);
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;

	}

	public BusinessException(String errCode, int es, Exception e) {
		super(errCode, e);
		this.errorCode = errorCode;
	}

	public BusinessException(BusinessException e) {
		this(e.getErrorCode(),e.getMessage());
	}

	public String getErrorCode() {
		return errorCode;
	}

	@Override
	public String getMessage() {

		// 如果errorMessage不为空,直接返回出错信息.
		if (errorMessage != null) {
			return errorMessage;
		}

		return "";
	}
}
