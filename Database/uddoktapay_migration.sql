USE scst_db;

-- =============================================
-- payments table এ UddoktaPay এর জন্য
-- নতুন columns যোগ করো
-- =============================================

ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS invoice_id     VARCHAR(100) UNIQUE AFTER payment_id,
    ADD COLUMN IF NOT EXISTS currency       VARCHAR(10)  DEFAULT 'BDT' AFTER amount,
    ADD COLUMN IF NOT EXISTS service_name   VARCHAR(100) AFTER currency,
    ADD COLUMN IF NOT EXISTS customer_name  VARCHAR(100) AFTER service_name,
    ADD COLUMN IF NOT EXISTS customer_mobile VARCHAR(20) AFTER customer_name,
    ADD COLUMN IF NOT EXISTS customer_email VARCHAR(100) AFTER customer_mobile,
    ADD COLUMN IF NOT EXISTS verified_at    TIMESTAMP NULL AFTER paid_at;

-- payment_status ENUM এ 'paid' যোগ করো
ALTER TABLE payments
    MODIFY COLUMN payment_status ENUM('pending', 'success', 'paid', 'failed', 'refunded') DEFAULT 'pending';

-- Verify
DESCRIBE payments;
