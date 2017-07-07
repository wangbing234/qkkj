package net.onlineshop.services.impl;

import net.onlineshop.core.ServersManager;
import net.onlineshop.dao.TransAreaDAO;
import net.onlineshop.services.TransAreaService;
import net.onlineshop.services.common.TransArea;

public class TransAreaServiceImpl extends ServersManager<TransArea> implements TransAreaService {

	private TransAreaDAO transAreaDAO;

	public TransAreaDAO getTransAreaDAO() {
		return transAreaDAO;
	}

	public void setTransAreaDAO(TransAreaDAO transAreaDAO) {
		this.transAreaDAO = transAreaDAO;
	}

}
