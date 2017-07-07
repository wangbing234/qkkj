package net.onlineshop.services.manage.supplierlinkman.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.manage.supplierlinkman.SupplierLinkmanService;
import net.onlineshop.services.manage.supplierlinkman.bean.SupplierLinkman;

public class SupplierLinkmanImpl extends ServersManager<SupplierLinkman> implements SupplierLinkmanService {
	

	/**
	 * 批量删除
	 * 
	 * @param ids
	 * @return
	 */
	public int deletes(String[] ids) {
		if (ids == null || ids.length == 0) {
			throw new NullPointerException("id不能全为空！");
		}

		for (int i = 0; i < ids.length; i++) {
			if (StringUtils.isBlank(ids[i])) {
				throw new NullPointerException("id不能为空！");
			}
//			accountDao.deleteById(Integer.parseInt(ids[i]));
		}
		return 0;
	}

	@Override
	public List<SupplierLinkman> selectList(SupplierLinkman e) {
		// TODO Auto-generated method stub
		return super.selectList(e);
	}


}
