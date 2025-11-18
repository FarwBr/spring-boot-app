package com.example.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@eventos.com}")
    private String fromEmail;
    
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email: " + e.getMessage());
        }
    }
    
    public void sendEmailWithAttachment(String to, String subject, String text, 
                                       byte[] attachment, String attachmentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true); // true = HTML
            
            if (attachment != null && attachment.length > 0) {
                helper.addAttachment(attachmentName, new ByteArrayResource(attachment));
            }
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar email com anexo: " + e.getMessage());
        }
    }
    
    public void sendCertificateEmail(String to, String participantName, 
                                    String eventName, byte[] certificatePdf) {
        String subject = "Certificado de Participação - " + eventName;
        
        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { background: #4CAF50; color: white; padding: 12px 30px; 
                             text-decoration: none; border-radius: 5px; display: inline-block; 
                             margin-top: 20px; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Parabéns!</h1>
                        <p>Certificado de Participação</p>
                    </div>
                    <div class="content">
                        <h2>Olá, %s!</h2>
                        <p>É com grande satisfação que enviamos seu <strong>Certificado de Participação</strong> 
                           no evento <strong>%s</strong>.</p>
                        <p>Agradecemos sua presença e esperamos vê-lo(a) em futuros eventos!</p>
                        <p><strong>📎 Seu certificado está anexado a este e-mail em formato PDF.</strong></p>
                        <p>Guarde-o com carinho como lembrança desta experiência!</p>
                        <div style="margin-top: 30px; padding: 15px; background: white; border-left: 4px solid #4CAF50;">
                            <p style="margin: 0;"><strong>💡 Dica:</strong> Você pode imprimir ou compartilhar 
                               seu certificado nas redes sociais!</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Este é um e-mail automático, por favor não responda.</p>
                        <p>© 2025 Sistema de Gestão de Eventos</p>
                    </div>
                </div>
            </body>
            </html>
            """, participantName, eventName);
        
        sendEmailWithAttachment(to, subject, htmlContent, certificatePdf, 
                              "Certificado_" + eventName.replaceAll("[^a-zA-Z0-9]", "_") + ".pdf");
    }
}
