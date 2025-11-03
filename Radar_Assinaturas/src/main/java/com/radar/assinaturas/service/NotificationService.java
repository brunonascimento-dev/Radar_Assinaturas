package com.radar.assinaturas.service;

import com.radar.assinaturas.model.Subscription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${app.notifications.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.notifications.email.to:}")
    private String emailTo;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void notifyUpcomingRenewals(List<Subscription> subs) {
        if (subs.isEmpty()) {
            return;
        }
        // Log notification (always)
        subs.forEach(s -> log.info("Assinatura próxima de renovar: {} em {} (R$ {})", s.getName(), s.getRenewalDate(), s.getPrice()));

        // Optionally send email if configured
        if (emailEnabled && emailTo != null && !emailTo.isBlank()) {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(emailTo);
            msg.setSubject("Assinaturas próximas de renovar");
            StringBuilder body = new StringBuilder("Estas assinaturas renovam em breve:\n\n");
            subs.forEach(s -> body.append("- ")
                    .append(s.getName())
                    .append(" em ")
                    .append(s.getRenewalDate())
                    .append(" (R$ ")
                    .append(s.getPrice())
                    .append(")\n"));
            msg.setText(body.toString());
            try {
                mailSender.send(msg);
                log.info("Email de notificação enviado para {}", emailTo);
            } catch (Exception e) {
                log.warn("Falha ao enviar email: {}", e.getMessage());
            }
        }
    }
}