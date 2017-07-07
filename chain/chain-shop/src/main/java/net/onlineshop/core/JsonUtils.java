package net.onlineshop.core;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

public class JsonUtils {

	public static <T> T fromJson(String json, Class<T> classOfT) throws JsonSyntaxException {
		return new Gson().fromJson(json, classOfT);
	}

	public static String toJson(Object src) {
		return new Gson().toJson(src);
	}

	public static <T> T fromJson(Class<T> classOfT, String json) {
		return fromJson(json, classOfT);
	}

}
