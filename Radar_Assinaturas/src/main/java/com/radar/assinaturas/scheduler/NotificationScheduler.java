package com.radar.assinaturas.scheduler;

import com.radar.assinaturas.model.Subscription;
import com.radar.assinaturas.service.NotificationService;
import com.radar.assinaturas.service.SubscriptionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class NotificationScheduler {

    private final SubscriptionService subscriptionService;
    private final NotificationService notificationService;

    public NotificationScheduler(SubscriptionService subscriptionService, NotificationService notificationService) {
        this.subscriptionService = subscriptionService;
        this.notificationService = notificationService;
    }

    // Verifica diariamente às 9h as assinaturas que renovam em 3 a 5 dias
    @Scheduled(cron = "0 0 9 * * *")
    public void notifyUpcomingRenewals() {
        LocalDate start = LocalDate.now().plusDays(3);
        LocalDate end = LocalDate.now().plusDays(5);
        List<Subscription> subs = subscriptionService.findRenewalsBetween(start, end);
        notificationService.notifyUpcomingRenewals(subs);
    }
}