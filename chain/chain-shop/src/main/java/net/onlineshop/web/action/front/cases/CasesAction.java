package net.onlineshop.web.action.front.cases;

import java.util.List;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.services.front.cases.CasesService;
import net.onlineshop.services.front.cases.bean.Cases;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 案例管理
 * 
 */
public class CasesAction extends BaseAction<Cases> {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(CasesAction.class);
	private CasesService casesService;

	private Cases cases;

	public Cases getCases() {
		return cases;
	}

	public void setCases(Cases cases) {
		this.cases = cases;
	}

	public void setCasesService(CasesService casesService) {
		this.casesService = casesService;
	}

	@Override
	public Cases getE() {
		return this.e;
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Cases();
		}
	}

	@Override
	public void insertAfter(Cases e) {
	}

	@Override
	protected void selectListAfter() {

		pager.setPagerUrl("/cases/list.html");
	}

	/**
	 * 获案列表
	 * 
	 * @return
	 */
	public String casesList() throws Exception {

		return "casesList";
	}

	public String loadCases() throws Exception {

		super.selectList();
		List<Cases> casesList = pager.getList();
		JSONObject json = new JSONObject();

		JSONArray ja = new JSONArray();
		for (Cases cases : casesList) {
			JSONObject jsonProduct = new JSONObject();
			jsonProduct.put("id", cases.getId());
			jsonProduct.put("name", cases.getTitle());
			jsonProduct.put("pic", cases.getPicUrl());
			jsonProduct.put("notes", cases.getNotes());
			ja.add(jsonProduct);

		}

		json.put("count", pager.getTotal());
		json.put("pageNo", pager.getOffset());
		json.put("pagerSize", pager.getPagerSize());
		json.put("pagerTotal", pager.getTotal());

		json.put("data", ja);

		this.write(json.toString());

		return null;
	}

	/**
	 * 获案例详细
	 * 
	 * @return
	 */
	public String casesInfo() throws Exception {

		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中

		String id = getRequest().getParameter("id");
		logger.debug("CasesAction.casesInfo=== id=" + id);
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("id is null");
		}

		// e = newsService.selectById(id);

		Cases casesParam = new Cases();
		casesParam.setId(id);
		e = casesService.selectOne(casesParam);
		if (e == null) {
			throw new NullPointerException();
		}

		return "casesInfo";
	}

}
