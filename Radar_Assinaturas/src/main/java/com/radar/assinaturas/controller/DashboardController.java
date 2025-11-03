package com.radar.assinaturas.controller;

import com.radar.assinaturas.service.SubscriptionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    private final SubscriptionService subscriptionService;

    public DashboardController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("monthlyTotal", subscriptionService.totalMonthlyCost());
        model.addAttribute("annualTotal", subscriptionService.totalAnnualCost());
        model.addAttribute("subscriptions", subscriptionService.findAll());
        return "dashboard";
    }
}