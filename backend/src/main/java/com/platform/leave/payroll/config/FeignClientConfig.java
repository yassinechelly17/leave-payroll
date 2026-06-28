package com.platform.leave.payroll.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("docker")
@EnableFeignClients(basePackages = "com.platform.leave.payroll.client")
public class FeignClientConfig {
}
