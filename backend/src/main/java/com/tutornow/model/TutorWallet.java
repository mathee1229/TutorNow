package com.tutornow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tutor_wallets")
public class TutorWallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tutor_id", nullable = false, unique = true)
    private User tutor;

    private BigDecimal availableBalance = BigDecimal.ZERO;
    private BigDecimal pendingEscrowBalance = BigDecimal.ZERO;

    public TutorWallet() {}

    public TutorWallet(Long id, User tutor, BigDecimal availableBalance, BigDecimal pendingEscrowBalance) {
        this.id = id;
        this.tutor = tutor;
        this.availableBalance = availableBalance != null ? availableBalance : BigDecimal.ZERO;
        this.pendingEscrowBalance = pendingEscrowBalance != null ? pendingEscrowBalance : BigDecimal.ZERO;
    }

    public static TutorWalletBuilder builder() {
        return new TutorWalletBuilder();
    }

    public static class TutorWalletBuilder {
        private Long id;
        private User tutor;
        private BigDecimal availableBalance = BigDecimal.ZERO;
        private BigDecimal pendingEscrowBalance = BigDecimal.ZERO;

        public TutorWalletBuilder id(Long id) { this.id = id; return this; }
        public TutorWalletBuilder tutor(User tutor) { this.tutor = tutor; return this; }
        public TutorWalletBuilder availableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; return this; }
        public TutorWalletBuilder pendingEscrowBalance(BigDecimal pendingEscrowBalance) { this.pendingEscrowBalance = pendingEscrowBalance; return this; }

        public TutorWallet build() {
            return new TutorWallet(id, tutor, availableBalance, pendingEscrowBalance);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getTutor() { return tutor; }
    public void setTutor(User tutor) { this.tutor = tutor; }
    public BigDecimal getAvailableBalance() { return availableBalance; }
    public void setAvailableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; }
    public BigDecimal getPendingEscrowBalance() { return pendingEscrowBalance; }
    public void setPendingEscrowBalance(BigDecimal pendingEscrowBalance) { this.pendingEscrowBalance = pendingEscrowBalance; }
}
