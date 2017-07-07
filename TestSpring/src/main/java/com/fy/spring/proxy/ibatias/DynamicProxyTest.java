package com.fy.spring.proxy.ibatias;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class DynamicProxyTest {  
    static interface IHello {  
    	/**
    	 * sdfs
    	 * @param str
    	 * @return
    	 */
        public String sayHello(String str);  
    }
          
    static class DynaProxy implements InvocationHandler {  
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
            System.out.println("dynamic proxy");  
            String str="";
            for (Object object : args) {
            	str+="---"+object.toString();
			}
            return new String("调用方法："+method.getName()+"方法参数："+str);  
        }  
    }  
      
    public static void main(String[] args) {  
        IHello hello = (IHello) Proxy.newProxyInstance(IHello.class.getClassLoader(), new Class[] { IHello.class }, new DynaProxy());  
        String str = hello.sayHello("ffffff");  
        System.out.println(str);  
    }  
}  