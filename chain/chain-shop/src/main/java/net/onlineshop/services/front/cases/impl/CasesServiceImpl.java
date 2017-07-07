/**
 * 2015-7-8
 * 
 */
package net.onlineshop.services.front.cases.impl;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.front.cases.CasesService;
import net.onlineshop.services.front.cases.bean.Cases;
import net.onlineshop.services.front.cases.dao.CasesDao;

/**
 * 
 */
public class CasesServiceImpl extends ServersManager<Cases> implements CasesService {
	private CasesDao casesDao;

	public void setCasesDao(CasesDao casesDao) {
		this.casesDao = casesDao;
	}

}
