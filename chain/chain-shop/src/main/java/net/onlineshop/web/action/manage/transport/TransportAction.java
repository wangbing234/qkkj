package net.onlineshop.web.action.manage.transport;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.CommUtil;
import net.onlineshop.core.JsonUtils;
import net.onlineshop.services.TransAreaService;
import net.onlineshop.services.TransportService;
import net.onlineshop.services.common.TransArea;
import net.onlineshop.services.common.Transport;

import org.apache.log4j.Logger;

/**
 * 
 * @author WUKEZHOU
 *
 */
/**
 * 邮费模板
 * 
 * 
 * 
 */

public class TransportAction extends BaseAction<Transport> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(TransportAction.class);

	private TransAreaService transAreaService;
	private TransportService transportService;
	private Transport e;

	public String list() {

		List<Transport> list = transportService.selectList(this.getE());
		this.getRequest().setAttribute("list", list);
		return "list";

	}

	public String deletes() throws Exception {

		getServer().deletes(getIds());
		return list();
	}

	public String toAdd() {

		return "toEdit";
	}

	public String toEdit() throws ClassNotFoundException {
		HttpServletRequest request = this.getRequest();
		String id = request.getParameter("id");
		if ((id != null) && (!id.equals(""))) {
			Transport transport = this.transportService.selectById(id);
			request.setAttribute("obj", transport);

			request.setAttribute("mail_trans_weight", query_transprot(transport.getTrans_mail_info(), "trans_weight"));
			request.setAttribute("mail_trans_fee", query_transprot(transport.getTrans_mail_info(), "trans_fee"));

			request.setAttribute("mail_trans_add_weight", query_transprot(transport.getTrans_mail_info(), "trans_add_weight"));
			request.setAttribute("mail_trans_add_fee", query_transprot(transport.getTrans_mail_info(), "trans_add_fee"));

			request.setAttribute("ems_trans_weight", query_transprot(transport.getTrans_ems_info(), "trans_weight"));
			request.setAttribute("ems_trans_fee", query_transprot(transport.getTrans_ems_info(), "trans_fee"));
			request.setAttribute("ems_trans_add_weight", query_transprot(transport.getTrans_ems_info(), "trans_add_weight"));
			request.setAttribute("ems_trans_add_fee", query_transprot(transport.getTrans_ems_info(), "trans_add_fee"));

			request.setAttribute("express_trans_weight", query_transprot(transport.getTrans_express_info(), "trans_weight"));
			request.setAttribute("express_trans_fee", query_transprot(transport.getTrans_express_info(), "trans_fee"));
			request.setAttribute("express_trans_add_weight", query_transprot(transport.getTrans_express_info(), "trans_add_weight"));
			request.setAttribute("express_trans_add_fee", query_transprot(transport.getTrans_express_info(), "trans_add_fee"));

			request.setAttribute("ems_trans_list", JsonUtils.fromJson(ArrayList.class, transport.getTrans_ems_info()));
			request.setAttribute("express_trans_list", JsonUtils.fromJson(ArrayList.class, transport.getTrans_express_info()));
			request.setAttribute("mail_trans_list", JsonUtils.fromJson(ArrayList.class, transport.getTrans_mail_info()));

		}

		return "toEdit";
	}

	public String add() {
		HttpServletRequest request = this.getRequest();
		String id = request.getParameter("id");
		String trans_name = request.getParameter("trans_name");
		String trans_mail = request.getParameter("trans_mail");
		String trans_express = request.getParameter("trans_express");
		String trans_ems = request.getParameter("trans_ems");
		String mail_city_count = request.getParameter("mail_city_count");
		String express_city_count = request.getParameter("express_city_count");
		String ems_city_count = request.getParameter("ems_city_count");
		String trans_time = request.getParameter("trans_time");
		String trans_type = request.getParameter("trans_type");// 0按件，1按重量，2按体积

		Transport transport = null;

		transport = new Transport();
		transport.setAddTime(new Date());
		transport.setTrans_name(trans_name);
		transport.setTrans_mail(CommUtil.null2Boolean(trans_mail));
		transport.setTrans_express(CommUtil.null2Boolean(trans_express));
		transport.setTrans_ems(CommUtil.null2Boolean(trans_ems));
		transport.setTrans_time(CommUtil.null2Int(trans_time));
		transport.setTrans_type(CommUtil.null2Int(trans_type));
		if (id != null && !id.equals("")) {
			transport.setId(id);

		}

		if (CommUtil.null2Boolean(trans_mail)) {
			List trans_mail_info = new ArrayList();
			Map map = new HashMap();
			map.put("city_id", "-1");
			map.put("city_name", "全国");
			map.put("trans_weight", request.getParameter("mail_trans_weight"));
			map.put("trans_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("mail_trans_fee"))));
			map.put("trans_add_weight", request.getParameter("mail_trans_add_weight"));
			map.put("trans_add_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("mail_trans_add_fee"))));
			trans_mail_info.add(map);
			for (int i = 1; i <= CommUtil.null2Int(mail_city_count); i++) {
				int trans_weight = CommUtil.null2Int(request.getParameter("mail_trans_weight" + i));
				String city_ids = CommUtil.null2String(request.getParameter("mail_city_ids" + i));
				if ((!city_ids.equals("")) && (trans_weight > 0)) {
					float trans_fee = CommUtil.null2Float(request.getParameter("mail_trans_fee" + i));
					String trans_add_weight = request.getParameter("mail_trans_add_weight" + i);
					float trans_add_fee = CommUtil.null2Float(request.getParameter("mail_trans_add_fee" + i));
					String city_name = CommUtil.null2String(request.getParameter("mail_city_names" + i));
					Map map1 = new HashMap();
					map1.put("city_id", city_ids);
					map1.put("city_name", city_name);
					map1.put("trans_weight", trans_weight + "");
					map1.put("trans_fee", Float.valueOf(trans_fee));
					map1.put("trans_add_weight", trans_add_weight);
					map1.put("trans_add_fee", Float.valueOf(trans_add_fee));
					trans_mail_info.add(map1);
				}
			}
			transport.setTrans_mail_info(JsonUtils.toJson(trans_mail_info));
		} else {

			transport.setTrans_mail_info(null);
			transport.setTrans_mail(false);

		}
		if (CommUtil.null2Boolean(trans_express)) {
			List trans_express_info = new ArrayList();
			Map map = new HashMap();
			map.put("city_id", "-1");
			map.put("city_name", "全国");
			map.put("trans_weight", request.getParameter("express_trans_weight"));
			map.put("trans_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("express_trans_fee"))));
			map.put("trans_add_weight", request.getParameter("express_trans_add_weight"));
			map.put("trans_add_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("express_trans_add_fee"))));
			trans_express_info.add(map);
			for (int i = 1; i <= CommUtil.null2Int(express_city_count); i++) {
				int trans_weight = CommUtil.null2Int(request.getParameter("express_trans_weight" + i));
				String city_ids = CommUtil.null2String(request.getParameter("express_city_ids" + i));
				if ((!city_ids.equals("")) && (trans_weight > 0)) {
					float trans_fee = CommUtil.null2Float(request.getParameter("express_trans_fee" + i));
					String trans_add_weight = request.getParameter("express_trans_add_weight" + i);
					float trans_add_fee = CommUtil.null2Float(request.getParameter("express_trans_add_fee" + i));
					String city_name = CommUtil.null2String(request.getParameter("express_city_names" + i));
					Map map1 = new HashMap();
					map1.put("city_id", city_ids);
					map1.put("city_name", city_name);
					map1.put("trans_weight", trans_weight + "");
					map1.put("trans_fee", Float.valueOf(trans_fee));
					map1.put("trans_add_weight", trans_add_weight);
					map1.put("trans_add_fee", Float.valueOf(trans_add_fee));
					trans_express_info.add(map1);
				}
			}
			transport.setTrans_express_info(JsonUtils.toJson(trans_express_info));
		} else {

			transport.setTrans_express_info(null);
			transport.setTrans_express(false);

		}
		if (CommUtil.null2Boolean(trans_ems)) {
			List trans_ems_info = new ArrayList();
			Map map = new HashMap();
			map.put("city_id", "-1");
			map.put("city_name", "全国");
			map.put("trans_weight", request.getParameter("ems_trans_weight"));
			map.put("trans_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("ems_trans_fee"))));
			map.put("trans_add_weight", request.getParameter("ems_trans_add_weight"));
			map.put("trans_add_fee", Float.valueOf(CommUtil.null2Float(request.getParameter("ems_trans_add_fee"))));
			trans_ems_info.add(map);
			for (int i = 1; i <= CommUtil.null2Int(ems_city_count); i++) {
				int trans_weight = CommUtil.null2Int(request.getParameter("ems_trans_weight" + i));
				String city_ids = CommUtil.null2String(request.getParameter("ems_city_ids" + i));
				if ((!city_ids.equals("")) && (trans_weight > 0)) {
					float trans_fee = CommUtil.null2Float(request.getParameter("ems_trans_fee" + i));
					int trans_add_weight = CommUtil.null2Int(request.getParameter("ems_trans_add_weight" + i));
					float trans_add_fee = CommUtil.null2Float(request.getParameter("ems_trans_add_fee" + i));
					String city_name = CommUtil.null2String(request.getParameter("ems_city_names" + i));
					Map map1 = new HashMap();
					map1.put("city_id", city_ids);
					map1.put("city_name", city_name);
					map1.put("trans_weight", trans_weight + "");
					map1.put("trans_fee", Float.valueOf(trans_fee));
					map1.put("trans_add_weight", trans_add_weight + "");
					map1.put("trans_add_fee", Float.valueOf(trans_add_fee));
					trans_ems_info.add(map1);
				}
			}
			transport.setTrans_ems_info(JsonUtils.toJson(trans_ems_info));
		} else {

			transport.setTrans_ems_info(null);
			transport.setTrans_ems(false);

		}
		transport.setAddTime(new Date());
		transport.setDeleteStatus(false);
		if (id == null || id.equals(""))
			this.transportService.insert(transport);
		else
			this.transportService.update(transport);

		return list();
	}

	public String edit() {

		return list();
	}

	public String transport_info() throws ClassNotFoundException {
		HttpServletRequest request = this.getRequest();
		String id = request.getParameter("id");
		String type = request.getParameter("type");

		if ((id != null) && (!id.equals(""))) {
			Transport transport = this.transportService.selectById(id);
			this.getRequest().setAttribute("obj", transport);

			if ((type == null) || (type.equals(""))) {
				type = CommUtil.null2String(request.getAttribute("type"));
			}
			if ((id == null) || (id.equals(""))) {
				id = CommUtil.null2String(request.getAttribute("id"));
			}
			if (CommUtil.null2String(type).equals("")) {
				type = "mail";
			}

		}

		return "info_" + type;
	}

	public String transport_area() {
		HttpServletRequest request = this.getRequest();

		String id = request.getParameter("id");
		String trans_city_type = request.getParameter("trans_city_type");
		String trans_index = request.getParameter("trans_index");
		TransArea area = new TransArea();
		List<TransArea> objs = transAreaService.selectList(area);
		List<TransArea> list = new ArrayList<TransArea>();
		for (TransArea obj : objs) {
			TransArea areac = new TransArea();
			id = obj.getId();
			areac.setParent_id(Long.valueOf(id));
			List<TransArea> objchild = transAreaService.selectList(areac);

			if (objchild != null && objchild.size() > 0) {

				List<TransArea> list1 = new ArrayList<TransArea>();
				for (TransArea info : objchild) {

					TransArea areac1 = new TransArea();
					id = info.getId();
					areac1.setParent_id(Long.valueOf(id));
					List<TransArea> objchild1 = transAreaService.selectList(areac1);

					info.setChilds(objchild1);

					list1.add(info);

				}

				obj.setChilds(list1);

			}

			list.add(obj);
		}

		this.getRequest().setAttribute("objs", list);
		this.getRequest().setAttribute("trans_city_type", trans_city_type);
		this.getRequest().setAttribute("trans_index", trans_index);

		return "area";
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Transport();
		} else {
			e.clear();
		}

	}

	public Transport getE() {

		return this.e;
	}

	@Override
	public void insertAfter(Transport e) {
		e.clear();

	}

	@Override
	protected void selectListAfter() {
		pager.setPagerUrl("transport!list.action");

	}

	public void setTransportService(TransportService transportService) {
		this.transportService = transportService;
	}

	public void setE(Transport e) {
		this.e = e;
	}

	public void setTransAreaService(TransAreaService transAreaService) {
		this.transAreaService = transAreaService;
	}

	private String query_transprot(String json, String mark) {
		String ret = "";
		List<Map> list = JsonUtils.fromJson(ArrayList.class, json);
		if(null!=list)
		{
			for (Map map : list) {
				if (CommUtil.null2String(map.get("city_id")).equals("-1")) {
					ret = CommUtil.null2String(map.get(mark));
				}
			}
		}
		
		return ret;
	}

}
