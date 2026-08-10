package com.infosys.realestate.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static String getCurrentDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DEFAULT_FORMAT));
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(DEFAULT_FORMAT));
    }

    private DateTimeUtil() {
        // Prevent object creation
    }
}