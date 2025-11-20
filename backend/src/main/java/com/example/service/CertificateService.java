package com.example.service;

import com.example.model.Certificate;
import com.example.model.Event;
import com.example.model.Participant;
import com.example.repository.CertificateRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class CertificateService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 32, Font.BOLD, new BaseColor(102, 126, 234));
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.NORMAL, BaseColor.BLACK);
    private static final Font BOLD_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.BLACK);
    private static final Font NAME_FONT = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, new BaseColor(118, 75, 162));
    
    public byte[] generateCertificate(Participant participant, Event event) {
        try {
            // Criar ou buscar certificado no banco
            Certificate certificate = getOrCreateCertificate(participant, event);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate()); // Paisagem
            PdfWriter.getInstance(document, baos);
            
            document.open();
            
            // Adicionar borda decorativa
            addBorder(document);
            
            // Espaçamento superior
            document.add(new Paragraph("\n\n\n"));
            
            // Título
            Paragraph title = new Paragraph("CERTIFICADO", TITLE_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph("\n"));
            
            // Subtítulo
            Paragraph subtitle = new Paragraph("DE PARTICIPAÇÃO", SUBTITLE_FONT);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);
            
            document.add(new Paragraph("\n\n"));
            
            // Texto principal
            Paragraph text1 = new Paragraph("Certificamos que", NORMAL_FONT);
            text1.setAlignment(Element.ALIGN_CENTER);
            document.add(text1);
            
            document.add(new Paragraph("\n"));
            
            // Nome do participante (destaque)
            String participantName = participant.getDisplayName();
            Paragraph name = new Paragraph(participantName, NAME_FONT);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);
            
            document.add(new Paragraph("\n"));
            
            // Texto do evento
            String eventText = String.format("participou do evento \"%s\"", event.getName());
            Paragraph eventInfo = new Paragraph(eventText, BOLD_FONT);
            eventInfo.setAlignment(Element.ALIGN_CENTER);
            document.add(eventInfo);
            
            document.add(new Paragraph("\n"));
            
            // Detalhes do evento
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");
            String dateInfo = String.format("realizado em %s, no dia %s",
                event.getLocation(),
                event.getStartTime().format(formatter));
            
            Paragraph details = new Paragraph(dateInfo, NORMAL_FONT);
            details.setAlignment(Element.ALIGN_CENTER);
            document.add(details);
            
            // Check-in info
            if (participant.getCheckInTime() != null) {
                String checkInInfo = String.format("Check-in realizado em: %s", 
                    participant.getCheckInTime().format(formatter));
                Paragraph checkIn = new Paragraph("\n" + checkInInfo, new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.GRAY));
                checkIn.setAlignment(Element.ALIGN_CENTER);
                document.add(checkIn);
            }
            
            document.add(new Paragraph("\n\n"));
            
            // Data de emissão
            String issueDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy"));
            Paragraph issued = new Paragraph("Emitido em: " + issueDate, 
                new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY));
            issued.setAlignment(Element.ALIGN_CENTER);
            document.add(issued);
            
            // Código de validação
            Paragraph validationCode = new Paragraph("Código de Validação: " + certificate.getValidationCode(),
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, new BaseColor(102, 126, 234)));
            validationCode.setAlignment(Element.ALIGN_CENTER);
            document.add(validationCode);
            
            document.add(new Paragraph("\n\n"));
            
            // Linha de assinatura
            Paragraph signatureLine = new Paragraph("_____________________________________", NORMAL_FONT);
            signatureLine.setAlignment(Element.ALIGN_CENTER);
            document.add(signatureLine);
            
            Paragraph signature = new Paragraph("Coordenação do Evento", 
                new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY));
            signature.setAlignment(Element.ALIGN_CENTER);
            document.add(signature);
            
            document.close();
            
            return baos.toByteArray();
            
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar certificado PDF: " + e.getMessage());
        }
    }
    
    private void addBorder(Document document) throws DocumentException {
        // Adiciona uma borda decorativa ao redor do documento
        Rectangle rect = new Rectangle(36, 36, 806, 559); // Margens em paisagem
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(2);
        rect.setBorderColor(new BaseColor(102, 126, 234));
        document.add(rect);
    }
    
    private Certificate getOrCreateCertificate(Participant participant, Event event) {
        Optional<Certificate> existing = certificateRepository.findByParticipantIdAndEventId(
            participant.getId(), 
            event.getId()
        );
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Certificate certificate = new Certificate();
        certificate.setParticipant(participant);
        certificate.setEvent(event);
        return certificateRepository.save(certificate);
    }
}
