package com.skillmatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SkillMatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillMatchApplication.class, args);
	}

}
