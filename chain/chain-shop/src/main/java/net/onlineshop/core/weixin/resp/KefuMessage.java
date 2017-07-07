package net.onlineshop.core.weixin.resp;

import net.onlineshop.core.weixin.bean.TransInfo;

public class KefuMessage extends BaseMessage {
	// 回复的消息内容
	private String Content;
	private TransInfo TransInfo;

	public TransInfo getTransInfo() {
		return TransInfo;
	}

	public void setTransInfo(TransInfo transInfo) {
		TransInfo = transInfo;
	}

	public String getContent() {
		return Content;
	}

	public void setContent(String content) {
		Content = content;
	}
}
