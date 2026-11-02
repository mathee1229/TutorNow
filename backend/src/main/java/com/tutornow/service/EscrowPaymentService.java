package com.tutornow.service;

import com.tutornow.dto.BookingDto;
import com.tutornow.dto.PaymentDto;
import com.tutornow.model.*;
import com.tutornow.repository.BookingRepository;
import com.tutornow.repository.LessonRequestRepository;
import com.tutornow.repository.TutorWalletRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;

@Service
public class EscrowPaymentService {

    private final BookingRepository bookingRepository;
    private final TutorWalletRepository tutorWalletRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final AuthService authService;

    @Value("${app.payhere.merchant-id:1211111}")
    private String merchantId;

    @Value("${app.payhere.merchant-secret:404E635266556A586E3272357538782F}")
    private String merchantSecret;

    @Value("${app.payhere.currency:LKR}")
    private String currency;

    @Value("${app.payhere.sandbox-mode:true}")
    private boolean isSandbox;

    public EscrowPaymentService(BookingRepository bookingRepository,
                                TutorWalletRepository tutorWalletRepository,
                                LessonRequestRepository lessonRequestRepository,
                                AuthService authService) {
        this.bookingRepository = bookingRepository;
        this.tutorWalletRepository = tutorWalletRepository;
        this.lessonRequestRepository = lessonRequestRepository;
        this.authService = authService;
    }

    public PaymentDto.PayHereCheckoutParams getPaymentParams(String studentEmail, Long bookingId) {
        User student = authService.getUserByEmail(studentEmail);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new IllegalStateException("Unauthorized access to booking payment");
        }

        String orderId = "TUTOR-" + booking.getId() + "-" + System.currentTimeMillis();
        DecimalFormat df = new DecimalFormat("0.00");
        String formattedAmount = df.format(booking.getAgreedPrice().setScale(2, RoundingMode.HALF_UP));

        String hash = generatePayHereHash(merchantId, orderId, formattedAmount, currency, merchantSecret);

        return PaymentDto.PayHereCheckoutParams.builder()
                .merchantId(merchantId)
                .returnUrl("http://localhost:5173/student/bookings?payment=success")
                .cancelUrl("http://localhost:5173/student/bookings?payment=cancelled")
                .notifyUrl("http://localhost:8080/api/v1/payments/ipn")
                .orderId(orderId)
                .items(booking.getLessonRequest().getSubject() + ": " + booking.getLessonRequest().getLessonTopic())
                .currency(currency)
                .amount(booking.getAgreedPrice())
                .firstName(student.getFullName().split(" ")[0])
                .lastName(student.getFullName().contains(" ") ? student.getFullName().substring(student.getFullName().indexOf(" ") + 1) : "Student")
                .email(student.getEmail())
                .phone(student.getPhoneNumber() != null ? student.getPhoneNumber() : "0770000000")
                .address("Colombo")
                .city("Colombo")
                .country("Sri Lanka")
                .hash(hash)
                .isSandbox(isSandbox)
                .build();
    }

    @Transactional
    public void processIpnNotification(PaymentDto.PayHereIpnPayload payload) {
        if ("2".equals(payload.getStatus_code())) {
            String[] parts = payload.getOrder_id().split("-");
            if (parts.length >= 2) {
                Long bookingId = Long.parseLong(parts[1]);
                Booking booking = bookingRepository.findById(bookingId).orElse(null);

                if (booking != null && booking.getPaymentStatus() == PaymentStatus.PENDING) {
                    booking.setPaymentStatus(PaymentStatus.ESCROW_HELD);
                    booking.setPayherePaymentId(payload.getPayment_id());
                    bookingRepository.save(booking);

                    TutorWallet wallet = tutorWalletRepository.findByTutor(booking.getTutor())
                            .orElseGet(() -> TutorWallet.builder()
                                    .tutor(booking.getTutor())
                                    .availableBalance(BigDecimal.ZERO)
                                    .pendingEscrowBalance(BigDecimal.ZERO)
                                    .build());

                    wallet.setPendingEscrowBalance(wallet.getPendingEscrowBalance().add(booking.getTutorPayout()));
                    tutorWalletRepository.save(wallet);
                }
            }
        }
    }

    @Transactional
    public BookingDto.BookingResponse simulateEscrowCapture(String studentEmail, Long bookingId) {
        User student = authService.getUserByEmail(studentEmail);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new IllegalStateException("Unauthorized access");
        }

        booking.setPaymentStatus(PaymentStatus.ESCROW_HELD);
        booking.setPayherePaymentId("PAYHERE-SB-" + System.currentTimeMillis());
        Booking savedBooking = bookingRepository.save(booking);

        TutorWallet wallet = tutorWalletRepository.findByTutor(savedBooking.getTutor())
                .orElseGet(() -> TutorWallet.builder()
                        .tutor(savedBooking.getTutor())
                        .availableBalance(BigDecimal.ZERO)
                        .pendingEscrowBalance(BigDecimal.ZERO)
                        .build());

        wallet.setPendingEscrowBalance(wallet.getPendingEscrowBalance().add(savedBooking.getTutorPayout()));
        tutorWalletRepository.save(wallet);

        return mapToBookingResponse(savedBooking, studentEmail);
    }

    @Transactional
    public BookingDto.BookingResponse completeLessonAndReleaseEscrow(String studentEmail, Long bookingId) {
        User student = authService.getUserByEmail(studentEmail);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new IllegalStateException("Only the student can confirm lesson completion");
        }

        if (booking.getPaymentStatus() != PaymentStatus.ESCROW_HELD) {
            throw new IllegalStateException("Payment must be in Escrow to release funds");
        }

        booking.setPaymentStatus(PaymentStatus.RELEASED_TO_TUTOR);
        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);

        LessonRequest request = booking.getLessonRequest();
        request.setStatus(RequestStatus.COMPLETED);
        lessonRequestRepository.save(request);

        TutorWallet wallet = tutorWalletRepository.findByTutor(booking.getTutor())
                .orElseThrow(() -> new IllegalStateException("Tutor wallet not found"));

        wallet.setPendingEscrowBalance(wallet.getPendingEscrowBalance().subtract(booking.getTutorPayout()));
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(booking.getTutorPayout()));
        tutorWalletRepository.save(wallet);

        return mapToBookingResponse(booking, studentEmail);
    }

    public BookingDto.BookingResponse getBookingDetails(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        return mapToBookingResponse(booking, userEmail);
    }

    public TutorWallet getTutorWallet(String tutorEmail) {
        User tutor = authService.getUserByEmail(tutorEmail);
        return tutorWalletRepository.findByTutor(tutor)
                .orElseGet(() -> TutorWallet.builder()
                        .tutor(tutor)
                        .availableBalance(BigDecimal.ZERO)
                        .pendingEscrowBalance(BigDecimal.ZERO)
                        .build());
    }

    public BookingDto.BookingResponse mapToBookingResponse(Booking b, String userEmail) {
        boolean canSeeAddress = b.getStudent().getEmail().equalsIgnoreCase(userEmail) ||
                (b.getTutor().getEmail().equalsIgnoreCase(userEmail) && b.getPaymentStatus() == PaymentStatus.ESCROW_HELD);

        String address = canSeeAddress ? b.getLessonRequest().getFullAddress() :
                (b.getLessonRequest().getDeliveryMode() == DeliveryMode.PHYSICAL ? "[Protected until Escrow payment is funded]" : "N/A (Online)");

        return BookingDto.BookingResponse.builder()
                .id(b.getId())
                .lessonRequestId(b.getLessonRequest().getId())
                .subject(b.getLessonRequest().getSubject())
                .lessonTopic(b.getLessonRequest().getLessonTopic())
                .deliveryMode(b.getLessonRequest().getDeliveryMode())
                .studentId(b.getStudent().getId())
                .studentName(b.getStudent().getFullName())
                .studentPhone(b.getStudent().getPhoneNumber())
                .tutorId(b.getTutor().getId())
                .tutorName(b.getTutor().getFullName())
                .tutorPhone(b.getTutor().getPhoneNumber())
                .agreedPrice(b.getAgreedPrice())
                .platformFee(b.getPlatformFee())
                .tutorPayout(b.getTutorPayout())
                .paymentStatus(b.getPaymentStatus())
                .payherePaymentId(b.getPayherePaymentId())
                .meetingLink(b.getMeetingLink())
                .status(b.getStatus())
                .fullAddress(address)
                .createdAt(b.getCreatedAt())
                .build();
    }

    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String secret) {
        try {
            String secretHash = md5(secret).toUpperCase();
            String combined = merchantId + orderId + amount + currency + secretHash;
            return md5(combined).toUpperCase();
        } catch (Exception e) {
            return "";
        }
    }

    private String md5(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
