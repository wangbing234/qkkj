package net.onlineshop.services.manage.supplier.dao;

import java.util.List;

import net.onlineshop.core.DaoManager;
import net.onlineshop.services.manage.supplier.bean.Supplier;

public interface SupplierDao extends DaoManager<Supplier> {
	public List<Supplier> selectListConst();
}
