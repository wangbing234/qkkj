package net.onlineshop.services.front.address;import net.onlineshop.core.Services;import net.onlineshop.services.front.address.bean.Address;public interface AddressService extends Services<Address> {	/**	 * 设置指定的地址为默认地址	 * 	 * @param address	 */	void setAddressDefault(Address address);}