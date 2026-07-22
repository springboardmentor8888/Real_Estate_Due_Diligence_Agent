package com.realestate.due_diligence.util;

public class AddressUtil {

    private AddressUtil() {
    }

    public static String normalizeAddress(String address,
                                          String city,
                                          String state,
                                          String zipCode) {

        return address.trim() + ", "
                + city.trim() + ", "
                + state.trim() + " "
                + zipCode.trim();
    }

    public static boolean isValidZipCode(String zipCode) {

        return zipCode != null && zipCode.matches("\\d{5}");
    }

    public static boolean isBlank(String value) {

        return value == null || value.trim().isEmpty();
    }
}