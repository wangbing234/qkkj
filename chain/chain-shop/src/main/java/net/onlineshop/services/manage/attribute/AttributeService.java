package net.onlineshop.services.manage.attribute;import net.onlineshop.core.Services;import net.onlineshop.services.manage.attribute.bean.Attribute;public interface AttributeService extends Services<Attribute> {	int selectCount(Attribute ee);}