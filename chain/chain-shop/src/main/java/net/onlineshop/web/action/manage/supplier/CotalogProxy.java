package net.onlineshop.web.action.manage.supplier;

import java.util.List;

import net.onlineshop.services.front.catalog.bean.Catalog;

public class CotalogProxy {
	private List<Catalog> catalogs;

	public List<Catalog> getCatalogs() {
		return catalogs;
	}

	public void setCatalogs(List<Catalog> catalogs) {
		this.catalogs = catalogs;
	}
	
}
