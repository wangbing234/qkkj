package net.onlineshop.core.weixin.resp;

public class VoiceMessage extends BaseMessage {
	// 回复的消息内容
	private Voice Voice;

	public Voice getVoice() {
		return Voice;
	}

	public void setVoice(Voice voice) {
		Voice = voice;
	}

}
