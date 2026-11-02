package com.tutornow.dto;

import java.math.BigDecimal;

public class PaymentDto {

    public static class PayHereCheckoutParams {
        private String merchantId;
        private String returnUrl;
        private String cancelUrl;
        private String notifyUrl;
        private String orderId;
        private String items;
        private String currency;
        private BigDecimal amount;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String country;
        private String hash;
        private boolean isSandbox;

        public PayHereCheckoutParams() {}

        public PayHereCheckoutParams(String merchantId, String returnUrl, String cancelUrl, String notifyUrl,
                                    String orderId, String items, String currency, BigDecimal amount,
                                    String firstName, String lastName, String email, String phone,
                                    String address, String city, String country, String hash, boolean isSandbox) {
            this.merchantId = merchantId;
            this.returnUrl = returnUrl;
            this.cancelUrl = cancelUrl;
            this.notifyUrl = notifyUrl;
            this.orderId = orderId;
            this.items = items;
            this.currency = currency;
            this.amount = amount;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.city = city;
            this.country = country;
            this.hash = hash;
            this.isSandbox = isSandbox;
        }

        public static PayHereCheckoutParamsBuilder builder() {
            return new PayHereCheckoutParamsBuilder();
        }

        public static class PayHereCheckoutParamsBuilder {
            private String merchantId;
            private String returnUrl;
            private String cancelUrl;
            private String notifyUrl;
            private String orderId;
            private String items;
            private String currency;
            private BigDecimal amount;
            private String firstName;
            private String lastName;
            private String email;
            private String phone;
            private String address;
            private String city;
            private String country;
            private String hash;
            private boolean isSandbox;

            public PayHereCheckoutParamsBuilder merchantId(String merchantId) { this.merchantId = merchantId; return this; }
            public PayHereCheckoutParamsBuilder returnUrl(String returnUrl) { this.returnUrl = returnUrl; return this; }
            public PayHereCheckoutParamsBuilder cancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; return this; }
            public PayHereCheckoutParamsBuilder notifyUrl(String notifyUrl) { this.notifyUrl = notifyUrl; return this; }
            public PayHereCheckoutParamsBuilder orderId(String orderId) { this.orderId = orderId; return this; }
            public PayHereCheckoutParamsBuilder items(String items) { this.items = items; return this; }
            public PayHereCheckoutParamsBuilder currency(String currency) { this.currency = currency; return this; }
            public PayHereCheckoutParamsBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
            public PayHereCheckoutParamsBuilder firstName(String firstName) { this.firstName = firstName; return this; }
            public PayHereCheckoutParamsBuilder lastName(String lastName) { this.lastName = lastName; return this; }
            public PayHereCheckoutParamsBuilder email(String email) { this.email = email; return this; }
            public PayHereCheckoutParamsBuilder phone(String phone) { this.phone = phone; return this; }
            public PayHereCheckoutParamsBuilder address(String address) { this.address = address; return this; }
            public PayHereCheckoutParamsBuilder city(String city) { this.city = city; return this; }
            public PayHereCheckoutParamsBuilder country(String country) { this.country = country; return this; }
            public PayHereCheckoutParamsBuilder hash(String hash) { this.hash = hash; return this; }
            public PayHereCheckoutParamsBuilder isSandbox(boolean isSandbox) { this.isSandbox = isSandbox; return this; }

            public PayHereCheckoutParams build() {
                return new PayHereCheckoutParams(merchantId, returnUrl, cancelUrl, notifyUrl, orderId, items, currency, amount, firstName, lastName, email, phone, address, city, country, hash, isSandbox);
            }
        }

        public String getMerchantId() { return merchantId; }
        public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
        public String getReturnUrl() { return returnUrl; }
        public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }
        public String getCancelUrl() { return cancelUrl; }
        public void setCancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; }
        public String getNotifyUrl() { return notifyUrl; }
        public void setNotifyUrl(String notifyUrl) { this.notifyUrl = notifyUrl; }
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getItems() { return items; }
        public void setItems(String items) { this.items = items; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
        public String getHash() { return hash; }
        public void setHash(String hash) { this.hash = hash; }
        public boolean isSandbox() { return isSandbox; }
        public void setSandbox(boolean sandbox) { isSandbox = sandbox; }
    }

    public static class PayHereIpnPayload {
        private String merchant_id;
        private String order_id;
        private String payment_id;
        private String payhere_amount;
        private String payhere_currency;
        private String status_code;
        private String md5sig;

        public PayHereIpnPayload() {}
        public PayHereIpnPayload(String merchant_id, String order_id, String payment_id, String payhere_amount, String payhere_currency, String status_code, String md5sig) {
            this.merchant_id = merchant_id;
            this.order_id = order_id;
            this.payment_id = payment_id;
            this.payhere_amount = payhere_amount;
            this.payhere_currency = payhere_currency;
            this.status_code = status_code;
            this.md5sig = md5sig;
        }

        public String getMerchant_id() { return merchant_id; }
        public void setMerchant_id(String merchant_id) { this.merchant_id = merchant_id; }
        public String getOrder_id() { return order_id; }
        public void setOrder_id(String order_id) { this.order_id = order_id; }
        public String getPayment_id() { return payment_id; }
        public void setPayment_id(String payment_id) { this.payment_id = payment_id; }
        public String getPayhere_amount() { return payhere_amount; }
        public void setPayhere_amount(String payhere_amount) { this.payhere_amount = payhere_amount; }
        public String getPayhere_currency() { return payhere_currency; }
        public void setPayhere_currency(String payhere_currency) { this.payhere_currency = payhere_currency; }
        public String getStatus_code() { return status_code; }
        public void setStatus_code(String status_code) { this.status_code = status_code; }
        public String getMd5sig() { return md5sig; }
        public void setMd5sig(String md5sig) { this.md5sig = md5sig; }
    }
}
