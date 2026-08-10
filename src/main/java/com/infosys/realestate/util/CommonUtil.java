package com.infosys.realestate.util;

public class CommonUtil {

    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static String trim(String value) {
        return value == null ? null : value.trim();
    }

    private CommonUtil() {
        // Prevent object creation
    }
}