package net.onlineshop.services.manage.supplier.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.front.account.bean.Busi;
import net.onlineshop.services.manage.supplier.SupplierService;
import net.onlineshop.services.manage.supplier.bean.Supplier;
import net.onlineshop.services.manage.supplier.dao.SupplierDao;
import net.onlineshop.services.manage.supplierlinkman.bean.SupplierLinkman;
import net.onlineshop.services.manage.supplierlinkman.dao.SupplierLinkmanDao;

public class SupplierServiceImpl extends ServersManager<Supplier> implements SupplierService {
	
	private SupplierLinkmanDao supplierLinkmanDao;

	
	public void setSupplierLinkmanDao(SupplierLinkmanDao supplierLinkmanDao) {
		this.supplierLinkmanDao = supplierLinkmanDao;
	}

	@Override
	public Supplier selectOne(Supplier e) {
		Supplier suppli = super.selectOne(e);
		SupplierLinkman supplierLinkman=new SupplierLinkman();
		supplierLinkman.setSupId(suppli.getId());
		List<SupplierLinkman> supplierLinkmanList = supplierLinkmanDao.selectList(supplierLinkman);
		if(supplierLinkmanList!=null && !supplierLinkmanList.isEmpty()) {
			suppli.setChildren(supplierLinkmanList);
		}
		return suppli;
	}
	
	@Override
	public int update(Supplier e) {
		int i=super.update(e);
		List<SupplierLinkman> childern = e.getChildren();
		if(null!=childern)
		{
			for (SupplierLinkman supplierLinkman : childern) {
				supplierLinkman.setSupId(i+"");
				//联系人不为空
				if(!StringUtils.isBlank(supplierLinkman.getName()))
				{
					//如果要删除标志，并且有id
					if(Busi.NO.equals(supplierLinkman.getIsDelete()+"") && StringUtils.isNotBlank(supplierLinkman.getId()))
					{
						supplierLinkmanDao.deleteById(Integer.parseInt(supplierLinkman.getId()));
					}
					else if(Busi.YES.equals(supplierLinkman.getIsDelete()+"") && StringUtils.isNotBlank(supplierLinkman.getId())){
						supplierLinkmanDao.update(supplierLinkman);
					}
					else if(Busi.YES.equals(supplierLinkman.getIsDelete()+"") && StringUtils.isBlank(supplierLinkman.getId())){
						supplierLinkmanDao.insert(supplierLinkman);
					}
					
				}
					
			}
		}
		return i;
	}
	
	@Override
	public int insert(Supplier e) {
		int i=super.insert(e);
		List<SupplierLinkman> childern = e.getChildren();
		for (SupplierLinkman supplierLinkman : childern) {
			supplierLinkman.setSupId(i+"");
			//联系人不为空
			if(StringUtils.isNotBlank(supplierLinkman.getName())){
				 if(1==supplierLinkman.getIsDelete()){
					supplierLinkmanDao.insert(supplierLinkman);
				}
			}
		}
		return i;
	}

	/**
	 * 批量删除
	 * 
	 * @param ids
	 * @return
	 */
	public int deletes(String[] ids) {
		super.deletes(ids);
		Supplier e=new Supplier();
		for (int i = 0; i < ids.length; i++) {
				e.setSupId(ids[i]);
				supplierLinkmanDao.delete(e);
		}
		
		return 0;
	}

	@Override
	public List<Supplier> selectListConst() {
		return ((SupplierDao)this.getDao()).selectListConst();
	}



}
