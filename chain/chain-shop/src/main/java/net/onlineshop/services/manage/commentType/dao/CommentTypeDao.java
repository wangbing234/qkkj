package net.onlineshop.services.manage.commentType.dao;import net.onlineshop.core.DaoManager;import net.onlineshop.services.manage.commentType.bean.CommentType;public interface CommentTypeDao extends DaoManager<CommentType> {	/**	 * 更新所有的评论插件为未选中	 */	void updateAllN();}