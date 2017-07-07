package com.fy.spring.proxy.test_instance;    
    
public class UserManagerImpl implements UserManager {    
    
	static{
		System.out.println("static UserManagerImpl");
	}
	public UserManagerImpl() {
		System.out.println("UserManagerImpl");
	}
    public void addUser(String id, String password) {    
        System.out.println(".: 掉用了UserManagerImpl.addUser()方法！ ");    
    
    }    
    
    public void delUser(String id) {    
        System.out.println(".: 掉用了UserManagerImpl.delUser()方法！ ");    
    
    }    
}   