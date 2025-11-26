package com.example.service;

import com.example.model.Event;
import com.example.model.Notification;
import com.example.model.Participant;
import com.example.model.User;
import com.example.repository.NotificationRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }
    
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    public List<Notification> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }
    
    public Notification createNotification(Notification notification) {
        Notification saved = notificationRepository.save(notification);
        
        // Enviar e-mail de forma assíncrona
        sendNotificationEmail(saved);
        
        return saved;
    }
    
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    
    public void markAllAsReadForUser(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }
    
    // Métodos específicos para criar notificações com e-mail
    
    public void notifyEventRegistration(User user, Event event) {
        String title = "Inscrição Confirmada";
        String message = String.format(
            "Sua inscrição no evento '%s' foi confirmada com sucesso! " +
            "Data: %s. Local: %s. Aguardamos você!",
            event.getName(),
            event.getStartTime().toString(),
            event.getLocation()
        );
        
        Notification notification = new Notification();
        notification.setUserId(user.getId());
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(Notification.NotificationType.GENERAL);
        
        createNotification(notification);
    }
    
    public void notifyCheckIn(Participant participant, Event event) {
        if (participant.getUser() != null) {
            String title = "Check-in Realizado";
            String message = String.format(
                "Check-in realizado com sucesso no evento '%s'! " +
                "Obrigado pela sua presença. Seu certificado será enviado em breve.",
                event.getName()
            );
            
            Notification notification = new Notification();
            notification.setUserId(participant.getUser().getId());
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(Notification.NotificationType.GENERAL);
            
            createNotification(notification);
        }
    }
    
    public void notifyEventFinished(User user, Event event) {
        String title = "Evento Finalizado";
        String message = String.format(
            "O evento '%s' foi finalizado! " +
            "Agradecemos sua participação. Seu certificado foi enviado por e-mail.",
            event.getName()
        );
        
        Notification notification = new Notification();
        notification.setUserId(user.getId());
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(Notification.NotificationType.GENERAL);
        
        createNotification(notification);
    }
    
    private void sendNotificationEmail(Notification notification) {
        new Thread(() -> {
            try {
                // Buscar usuário para obter email
                Optional<User> userOpt = userRepository.findById(notification.getUserId());
                
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    String email = user.getEmail();
                    
                    if (email != null && !email.isEmpty()) {
                        String htmlContent = buildEmailContent(notification, user);
                        emailService.sendEmailWithAttachment(
                            email,
                            notification.getTitle(),
                            htmlContent,
                            null,
                            null
                        );
                        
                        System.out.println("📧 Notificação enviada por e-mail para: " + email);
                    }
                }
            } catch (Exception e) {
                System.err.println("❌ Erro ao enviar notificação por e-mail: " + e.getMessage());
            }
        }).start();
    }
    
    private String buildEmailContent(Notification notification, User user) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .notification-box { background: white; padding: 20px; border-radius: 8px; 
                                       margin: 20px 0; border-left: 4px solid #667eea; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 Nova Notificação</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, %s!</h2>
                        <div class="notification-box">
                            <h3>%s</h3>
                            <p>%s</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            Esta notificação também está disponível no seu painel do sistema.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Este é um e-mail automático, por favor não responda.</p>
                        <p>© 2025 Sistema de Gestão de Eventos</p>
                    </div>
                </div>
            </body>
            </html>
            """, user.getName(), notification.getTitle(), notification.getMessage());
    }
}
