package net.onlineshop.core.emun;

import java.util.ArrayList;
import java.util.List;

public enum ProductType {  
   DONATION("消费商品", 31), POINT("积分商品", 37);  
    // 成员变量  
    private String name;
    private Integer index;  
    public static  List<ProductType> getProductList(){
    	List<ProductType> list=new ArrayList<ProductType>();
    	list.add(ProductType.DONATION);
    	list.add(ProductType.POINT);
    	return list;
    }
    // 构造方法  
    private ProductType(String name, Integer index) {  
        this.name = name;  
        this.index = index;  
    }  
    // 普通方法  
    public static String getName(Integer index) {  
        for (ProductType c : ProductType.values()) {  
            if (c.getIndex() == index) {  
                return c.name;  
            }  
        }  
        return null;  
    }  
    // get set 方法  
    public String getName() {  
        return name;  
    }  
    public void setName(String name) {  
        this.name = name;  
    }  
    public int getIndex() {  
        return index;  
    }  
    public String getCode() {  
        return index.toString();  
    }  
    public void setIndex(Integer index) {  
        this.index = index;  
    }  
}  