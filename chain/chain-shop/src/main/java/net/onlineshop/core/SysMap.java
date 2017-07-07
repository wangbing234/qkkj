package net.onlineshop.core;

public class SysMap {
	private Object key;
	private Object value;
	private String type;

	public SysMap() {
	}

	public SysMap(Object key, Object value, String tyoe) {
		this.key = key;
		this.value = value;
		this.type = tyoe;
	}

	public Object getKey() {
		return this.key;
	}

	public void setKey(Object key) {
		this.key = key;
	}

	public Object getValue() {
		return this.value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
