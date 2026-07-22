package com.realestate.due_diligence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class DueDiligenceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DueDiligenceApplication.class, args);
	}

}
