package net.onlineshop.services.manage.spec.dao;import net.onlineshop.core.DaoManager;import net.onlineshop.services.manage.spec.bean.Spec;public interface SpecDao extends DaoManager<Spec> {	public Integer selectStockById(int id);}