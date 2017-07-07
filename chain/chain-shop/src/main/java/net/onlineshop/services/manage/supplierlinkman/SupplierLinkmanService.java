package net.onlineshop.services.manage.supplierlinkman;

import java.util.List;

import net.onlineshop.core.Services;
import net.onlineshop.services.manage.supplierlinkman.bean.SupplierLinkman;

public interface SupplierLinkmanService extends Services<SupplierLinkman> {
	
	@Override
	List<SupplierLinkman> selectList(SupplierLinkman e);
}
