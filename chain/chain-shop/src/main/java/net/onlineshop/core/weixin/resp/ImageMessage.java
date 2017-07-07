package net.onlineshop.core.weixin.resp;

public class ImageMessage extends BaseMessage {
	// 回复的消息内容
	private Image Image;

	public Image getImage() {
		return Image;
	}

	public void setImage(Image image) {
		Image = image;
	}

}
