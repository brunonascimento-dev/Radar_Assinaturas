package com.radar.assinaturas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.radar.assinaturas.model.Frequency;
import com.radar.assinaturas.model.Category;
import com.radar.assinaturas.model.Subscription;
import com.radar.assinaturas.service.SubscriptionService;

@SpringBootApplication
@EnableScheduling
public class RadarAssinaturasApplication {

    public static void main(String[] args) {
        SpringApplication.run(RadarAssinaturasApplication.class, args);
    }

    @Bean
    public org.springframework.boot.CommandLineRunner seedData(SubscriptionService subscriptionService) {
        return args -> {
            if (subscriptionService.count() == 0) {
                subscriptionService.save(new Subscription(
                        null,
                        "Netflix",
                        new BigDecimal("39.90"),
                        LocalDate.now().plusDays(10),
                        Frequency.MONTHLY,
                        Category.STREAMING
                ));
                subscriptionService.save(new Subscription(
                        null,
                        "Spotify",
                        new BigDecimal("19.90"),
                        LocalDate.now().plusDays(25),
                        Frequency.MONTHLY,
                        Category.MUSIC
                ));
                subscriptionService.save(new Subscription(
                        null,
                        "Antivírus Anual",
                        new BigDecimal("120.00"),
                        LocalDate.now().plusDays(4),
                        Frequency.ANNUAL,
                        Category.SECURITY
                ));
            }
        };
    }
}
