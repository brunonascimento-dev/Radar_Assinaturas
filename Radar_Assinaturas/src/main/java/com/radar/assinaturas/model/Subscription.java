package com.radar.assinaturas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.radar.assinaturas.model.Category;

@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 10, fraction = 2)
    private BigDecimal price;

    @NotNull
    private LocalDate renewalDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Category category = Category.OTHER;

    public Subscription() {
    }

    public Subscription(Long id, String name, BigDecimal price, LocalDate renewalDate, Frequency frequency) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.renewalDate = renewalDate;
        this.frequency = frequency;
    }

    public Subscription(Long id, String name, BigDecimal price, LocalDate renewalDate, Frequency frequency, Category category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.renewalDate = renewalDate;
        this.frequency = frequency;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDate renewalDate) {
        this.renewalDate = renewalDate;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}