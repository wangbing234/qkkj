package net.onlineshop.services.manage.supplier;

import java.util.List;

import net.onlineshop.core.Services;
import net.onlineshop.services.manage.supplier.bean.Supplier;

public interface SupplierService extends Services<Supplier> {
	public List<Supplier> selectListConst();
}
