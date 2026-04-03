USE scst_db;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    mobile      VARCHAR(15)  NOT NULL UNIQUE,
    email       VARCHAR(100),
    current_address VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role        ENUM('citizen', 'officer', 'admin') DEFAULT 'citizen',
    otp         VARCHAR(10),
    otp_expires DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_mobile (mobile),
    INDEX idx_role   (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- APPLICATIONS TABLE
-- (Birth Certificate New - সব তথ্য এখানেই)
-- =============================================
CREATE TABLE applications (
    app_id              INT PRIMARY KEY AUTO_INCREMENT,
    user_id             INT NOT NULL,
    tracking_id         VARCHAR(20) UNIQUE NOT NULL,

    -- ---- Applicant / Child Info ----
    child_name_bn       VARCHAR(100),
    child_name_en       VARCHAR(100),
    birth_date          DATE,
    birth_place         VARCHAR(200),
    gender              ENUM('male', 'female', 'other'),

    -- ---- Father Info ----
    father_name_bn      VARCHAR(100),
    father_name_en      VARCHAR(100),
    father_nid          VARCHAR(20),

    -- ---- Mother Info ----
    mother_name_bn      VARCHAR(100),
    mother_name_en      VARCHAR(100),
    mother_nid          VARCHAR(20),

    -- ---- Address ----
    permanent_address   TEXT,

    -- ---- Application Status & Admin ----
    status              ENUM('pending', 'processing', 'verified', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    fee_amount          DECIMAL(10,2),
    assigned_officer_id INT,
    rejection_reason    TEXT,

    -- ---- Timestamps ----
    submitted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at         TIMESTAMP NULL,
    completed_at        TIMESTAMP NULL,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)             REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,

    INDEX idx_tracking   (tracking_id),
    INDEX idx_user       (user_id),
    INDEX idx_status     (status),
    INDEX idx_birth_date (birth_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- DOCUMENTS TABLE
-- =============================================
CREATE TABLE documents (
    doc_id      INT PRIMARY KEY AUTO_INCREMENT,
    app_id      INT NOT NULL,
    doc_type    VARCHAR(50)  NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(255) NOT NULL,
    file_size   INT,
    mime_type   VARCHAR(50),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (app_id)      REFERENCES applications(app_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)       ON DELETE CASCADE,

    INDEX idx_app      (app_id),
    INDEX idx_doc_type (doc_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE payments (
    payment_id     INT PRIMARY KEY AUTO_INCREMENT,
    app_id         INT NOT NULL,
    user_id        INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    amount         DECIMAL(10,2) NOT NULL,
    payment_method ENUM('bkash', 'nagad', 'rocket', 'card', 'bank') NOT NULL,
    payment_status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    gateway_response JSON,
    receipt_url    VARCHAR(255),
    paid_at        TIMESTAMP NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (app_id)   REFERENCES applications(app_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(user_id)       ON DELETE CASCADE,

    INDEX idx_transaction (transaction_id),
    INDEX idx_app         (app_id),
    INDEX idx_user        (user_id),
    INDEX idx_status      (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    notif_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id    INT NOT NULL,
    app_id     INT,
    title      VARCHAR(200) NOT NULL,
    message    TEXT NOT NULL,
    type       ENUM('sms', 'email', 'app', 'push') DEFAULT 'app',
    status     ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    is_read    BOOLEAN DEFAULT FALSE,
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at    TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id)       ON DELETE CASCADE,
    FOREIGN KEY (app_id)  REFERENCES applications(app_id) ON DELETE SET NULL,

    INDEX idx_user_read (user_id, is_read),
    INDEX idx_status    (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- FEEDBACK & COMPLAINTS TABLE
-- =============================================
CREATE TABLE feedback_complaints (
    feedback_id     INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    app_id          INT,
    type            ENUM('feedback', 'complaint') NOT NULL,
    category        VARCHAR(100),
    subject         VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    status          ENUM('pending', 'in_review', 'resolved', 'closed') DEFAULT 'pending',
    assigned_to     INT,
    resolution_note TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP NULL,

    FOREIGN KEY (user_id)     REFERENCES users(user_id)       ON DELETE CASCADE,
    FOREIGN KEY (app_id)      REFERENCES applications(app_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)       ON DELETE SET NULL,

    INDEX idx_user   (user_id),
    INDEX idx_type   (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- OFFICERS TABLE
-- =============================================
CREATE TABLE officers (
    officer_id      INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    employee_id     VARCHAR(50) UNIQUE,
    department      VARCHAR(100),
    designation     VARCHAR(100),
    office_location VARCHAR(200),
    is_active       BOOLEAN DEFAULT TRUE,
    joined_at       DATE,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_user       (user_id),
    INDEX idx_department (department),
    INDEX idx_active     (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- SERVICE FEE TABLE (Fixed - Birth New Only)
-- =============================================
CREATE TABLE service_fees (
    fee_id         INT PRIMARY KEY AUTO_INCREMENT,
    service_name   VARCHAR(100) NOT NULL DEFAULT 'New Birth Certificate',
    fee_amount     DECIMAL(10,2) NOT NULL,
    is_active      BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- APPLICATION STATUS HISTORY TABLE
-- =============================================
CREATE TABLE application_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    app_id     INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT NOT NULL,
    remarks    TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (app_id)     REFERENCES applications(app_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)       ON DELETE CASCADE,

    INDEX idx_app        (app_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
    log_id      INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT,
    action      VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id   INT,
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    details     JSON,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,

    INDEX idx_user    (user_id),
    INDEX idx_action  (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
