package com.radar.assinaturas.service;

import com.radar.assinaturas.model.Frequency;
import com.radar.assinaturas.model.Subscription;
import com.radar.assinaturas.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SubscriptionService {
    private final SubscriptionRepository repository;

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    public List<Subscription> findAll() {
        return repository.findAll();
    }

    public Optional<Subscription> findById(Long id) {
        return repository.findById(id);
    }

    public Subscription save(Subscription sub) {
        return repository.save(sub);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public long count() { return repository.count(); }

    public BigDecimal monthlyCostOf(Subscription s) {
        if (s.getFrequency() == Frequency.MONTHLY) {
            return s.getPrice();
        }
        return s.getPrice().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal totalMonthlyCost() {
        return repository.findAll().stream()
                .map(this::monthlyCostOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal totalAnnualCost() {
        return totalMonthlyCost().multiply(BigDecimal.valueOf(12));
    }

    public List<Subscription> findRenewalsBetween(LocalDate start, LocalDate end) {
        return repository.findByRenewalDateBetween(start, end);
    }
}