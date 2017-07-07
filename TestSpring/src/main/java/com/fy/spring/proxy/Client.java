package com.fy.spring.proxy;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.bcel.generic.LoadClass;

import com.fy.spring.proxy.cglib.CGLibProxy;
import com.fy.spring.proxy.jdkproxy.JDKProxy;
import com.fy.spring.proxy.test_instance.UserManager;
import com.fy.spring.proxy.test_instance.UserManagerImpl;

public class Client {    
    
	/**
	 * 调用方法，实现类，实现代理
	 * @param args
	 * @throws InstantiationException 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws ClassNotFoundException 
	 */
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, InstantiationException {    
//    	testCGLibProxy();
//    	testJDKProxy();
    	loadClass();
    }    
    
    private static void testCGLibProxy() {
    	  UserManager userManager = (UserManager) new CGLibProxy().createProxyObject(new UserManagerImpl());    
          System.out.println("-----------CGLibProxy-------------");    
          userManager.addUser("tom", "root");    
	}
    
    private static void testJDKProxy() {
    	  System.out.println("-----------JDKProxy-------------");    
          JDKProxy jdkPrpxy = new JDKProxy();    
          UserManager userManagerJDK = (UserManager) jdkPrpxy .newProxy(new UserManagerImpl());    
          userManagerJDK.addUser("tom", "root");    
	}
    
  //ClassLoader loadClass  加载类,不实例化
   // Class.forName 加载，并且实例化
    private static void loadClass() throws ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, InstantiationException {
		// TODO Auto-generated method stub
    	ClassLoader classLoader = Client.class.getClassLoader();
    	Thread.currentThread().setContextClassLoader(classLoader);  
//    	Class.forName("com.fy.spring.proxy.test_instance.UserManagerImpl");
    	Class clazz=classLoader.loadClass("com.fy.spring.proxy.test_instance.UserManagerImpl");//使用loadClass方法加载class,这个class是在urls参数指定的classpath下边。  
    	Method taskMethod = clazz.getMethod("addUser", String.class, String.class);//然后我们就可以用反射做些事情了  
    	taskMethod.invoke(clazz.newInstance(),"hello","world");
	}
    
}   