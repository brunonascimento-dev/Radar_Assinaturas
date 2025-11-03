package com.radar.assinaturas.controller;

import com.radar.assinaturas.model.Frequency;
import com.radar.assinaturas.model.Category;
import com.radar.assinaturas.model.Subscription;
import com.radar.assinaturas.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping(value = "/export.csv")
    @ResponseBody
    public org.springframework.http.ResponseEntity<String> exportCsv(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "frequency", required = false) Frequency frequency,
            @RequestParam(value = "category", required = false) Category category) {
        var items = subscriptionService.findAll();
        if (q != null && !q.isBlank()) {
            String qLower = q.toLowerCase();
            items = items.stream().filter(s -> s.getName() != null && s.getName().toLowerCase().contains(qLower)).toList();
        }
        if (frequency != null) {
            items = items.stream().filter(s -> s.getFrequency() == frequency).toList();
        }
        if (category != null) {
            items = items.stream().filter(s -> s.getCategory() == category).toList();
        }
        StringBuilder csv = new StringBuilder("id,nome,valor,frequencia,categoria,renovacao\n");
        items.forEach(s -> csv.append(s.getId() == null ? "" : s.getId())
                .append(',').append(escapeCsv(s.getName()))
                .append(',').append(s.getPrice())
                .append(',').append(s.getFrequency())
                .append(',').append(s.getCategory())
                .append(',').append(s.getRenewalDate())
                .append('\n'));
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=assinaturas.csv")
                .body(csv.toString());
    }

    private String escapeCsv(String v) {
        if (v == null) return "";
        boolean needsQuotes = v.contains(",") || v.contains("\n") || v.contains("\r") || v.contains("\"");
        String escaped = v.replace("\"", "\"\"");
        return needsQuotes ? ('"' + escaped + '"') : escaped;
    }

    @GetMapping
    public String list(@RequestParam(value = "q", required = false) String q,
                       @RequestParam(value = "frequency", required = false) Frequency frequency,
                       @RequestParam(value = "category", required = false) Category category,
                       Model model) {
        var items = subscriptionService.findAll();
        if (q != null && !q.isBlank()) {
            String qLower = q.toLowerCase();
            items = items.stream().filter(s -> s.getName() != null && s.getName().toLowerCase().contains(qLower)).toList();
        }
        if (frequency != null) {
            items = items.stream().filter(s -> s.getFrequency() == frequency).toList();
        }
        if (category != null) {
            items = items.stream().filter(s -> s.getCategory() == category).toList();
        }
        // Upcoming renewals in 3-5 days for highlighting
        var upcoming = subscriptionService.findRenewalsBetween(java.time.LocalDate.now().plusDays(3), java.time.LocalDate.now().plusDays(5));
        java.util.Set<Long> upcomingIds = upcoming.stream()
                .map(com.radar.assinaturas.model.Subscription::getId)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        // days until renewal map
        java.util.Map<Long, Integer> daysLeftById = new java.util.HashMap<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        items.forEach(s -> {
            if (s.getId() != null && s.getRenewalDate() != null) {
                int days = (int) java.time.temporal.ChronoUnit.DAYS.between(today, s.getRenewalDate());
                daysLeftById.put(s.getId(), days);
            }
        });
        model.addAttribute("subscriptions", items);
        model.addAttribute("categories", Category.values());
        model.addAttribute("daysLeftById", daysLeftById);
        model.addAttribute("upcomingIds", upcomingIds);
        return "subscriptions/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("subscription", new Subscription());
        model.addAttribute("frequencies", Frequency.values());
        model.addAttribute("categories", Category.values());
        return "subscriptions/form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("subscription") Subscription subscription,
                         BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("frequencies", Frequency.values());
            model.addAttribute("categories", Category.values());
            return "subscriptions/form";
        }
        subscriptionService.save(subscription);
        return "redirect:/subscriptions";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Subscription sub = subscriptionService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assinatura não encontrada"));
        model.addAttribute("subscription", sub);
        model.addAttribute("frequencies", Frequency.values());
        model.addAttribute("categories", Category.values());
        return "subscriptions/form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("subscription") Subscription subscription,
                         BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("frequencies", Frequency.values());
            model.addAttribute("categories", Category.values());
            return "subscriptions/form";
        }
        subscription.setId(id);
        subscriptionService.save(subscription);
        return "redirect:/subscriptions";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        subscriptionService.deleteById(id);
        return "redirect:/subscriptions";
    }
}