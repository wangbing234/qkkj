package net.onlineshop.services.front.questionnaire.dao.impl;import java.util.List;import net.onlineshop.core.dao.BaseDao;import net.onlineshop.core.dao.page.PagerModel;import net.onlineshop.services.front.questionnaire.bean.Questionnaire;import net.onlineshop.services.front.questionnaire.dao.QuestionnaireDao;public class QuestionnaireDaoImpl implements QuestionnaireDao {	private BaseDao dao;	public void setDao(BaseDao dao) {		this.dao = dao;	}	public PagerModel selectPageList(Questionnaire e) {		return dao.selectPageList("front.questionnaire.selectPageList", "front.questionnaire.selectPageCount", e);	}	public List selectList(Questionnaire e) {		return dao.selectList("front.questionnaire.selectList", e);	}	public Questionnaire selectOne(Questionnaire e) {		return (Questionnaire) dao.selectOne("front.questionnaire.selectOne", e);	}	public int delete(Questionnaire e) {		return dao.delete("front.questionnaire.delete", e);	}	public int update(Questionnaire e) {		return dao.update("front.questionnaire.update", e);	}	public int deletes(String[] ids) {		Questionnaire e = new Questionnaire();		for (int i = 0; i < ids.length; i++) {			e.setId(ids[i]);			delete(e);		}		return 0;	}	public int insert(Questionnaire e) {		return dao.insert("front.questionnaire.insert", e);	}	public int deleteById(int id) {		return dao.delete("front.questionnaire.deleteById", id);	}	@Override	public Questionnaire selectById(String id) {		return (Questionnaire) dao.selectOne("front.questionnaire.selectById", id);	}}