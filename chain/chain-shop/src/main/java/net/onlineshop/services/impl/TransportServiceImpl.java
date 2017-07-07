package net.onlineshop.services.impl;

import net.onlineshop.core.ServersManager;
import net.onlineshop.dao.TransportDAO;
import net.onlineshop.services.TransportService;
import net.onlineshop.services.common.Transport;

public class TransportServiceImpl extends ServersManager<Transport> implements TransportService {

	private TransportDAO transportDAO;

	public TransportDAO getTransportDAO() {
		return transportDAO;
	}

	public void setTransportDAO(TransportDAO transportDAO) {
		this.transportDAO = transportDAO;
	}

}
