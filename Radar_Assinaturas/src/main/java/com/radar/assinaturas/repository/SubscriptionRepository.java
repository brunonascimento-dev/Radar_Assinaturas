package com.radar.assinaturas.repository;

import com.radar.assinaturas.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByRenewalDateBetween(LocalDate start, LocalDate end);
}