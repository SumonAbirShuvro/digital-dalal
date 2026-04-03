USE scst_db;

-- =============================================
-- USERS (2 citizen, 2 officer, 1 admin)
-- =============================================
INSERT INTO users (name, mobile, email, current_address, password_hash, role, is_verified) VALUES
('Rahim Uddin',        '01711111111', 'rahim@gmail.com',   'Mirpur-10, Dhaka',        '$2b$10$hashedpassword1', 'citizen', TRUE),
('Fatema Begum',       '01722222222', 'fatema@gmail.com',  'Uttara, Dhaka',            '$2b$10$hashedpassword2', 'citizen', TRUE),
('Karim Hossain',      '01733333333', 'karim@gmail.com',   'Chittagong Sadar',         '$2b$10$hashedpassword3', 'citizen', FALSE),
('Officer Nasrin',     '01744444444', 'nasrin@gov.bd',     'Dhaka City Corporation',   '$2b$10$hashedpassword4', 'officer', TRUE),
('Officer Jamal',      '01755555555', 'jamal@gov.bd',      'Dhaka City Corporation',   '$2b$10$hashedpassword5', 'officer', TRUE),
('Admin Sumaiya',      '01766666666', 'admin@scst.gov.bd', 'Segunbagicha, Dhaka',      '$2b$10$hashedpassword6', 'admin',   TRUE);


-- =============================================
-- OFFICERS
-- =============================================
INSERT INTO officers (user_id, employee_id, department, designation, office_location, is_active, joined_at) VALUES
(4, 'EMP-2021-001', 'Birth & Death Registration', 'Registration Officer',        'Dhaka North City Corporation', TRUE, '2021-03-15'),
(5, 'EMP-2019-045', 'Birth & Death Registration', 'Senior Registration Officer', 'Dhaka South City Corporation', TRUE, '2019-07-01');


-- =============================================
-- SERVICE FEES
-- =============================================
INSERT INTO service_fees (service_name, fee_amount, is_active, effective_from) VALUES
('New Birth Certificate', 50.00, TRUE, '2024-01-01');


-- =============================================
-- APPLICATIONS
-- =============================================
INSERT INTO applications (
    user_id, tracking_id,
    child_name_bn, child_name_en, birth_date, birth_place, gender,
    father_name_bn, father_name_en, father_nid,
    mother_name_bn, mother_name_en, mother_nid,
    permanent_address,
    status, fee_amount, assigned_officer_id,
    approved_at, completed_at
) VALUES
-- Application 1: completed
(1, 'TRK-2024-000001',
 'আরিয়ান রহিম', 'Ariyan Rahim', '2023-05-10', 'Dhaka Medical College Hospital', 'male',
 'রহিম উদ্দিন', 'Rahim Uddin', '1234567890123',
 'সালমা বেগম', 'Salma Begum', '9876543210123',
 'বাড়ি-৫, রোড-৩, মিরপুর-১০, ঢাকা',
 'completed', 50.00, 4,
 '2024-02-15 10:30:00', '2024-02-20 14:00:00'),

-- Application 2: approved
(2, 'TRK-2024-000002',
 'তাসনিম ফাতেমা', 'Tasnim Fatema', '2023-11-22', 'Ibn Sina Hospital, Dhaka', 'female',
 'করিম শেখ', 'Karim Sheikh', '1112223334445',
 'ফাতেমা বেগম', 'Fatema Begum', '5556667778889',
 'বাড়ি-১২, সেক্টর-৭, উত্তরা, ঢাকা',
 'approved', 50.00, 5,
 '2024-03-10 09:00:00', NULL),

-- Application 3: processing
(1, 'TRK-2024-000003',
 'রায়হান রহিম', 'Rayhan Rahim', '2024-01-05', 'Popular Hospital, Dhaka', 'male',
 'রহিম উদ্দিন', 'Rahim Uddin', '1234567890123',
 'সালমা বেগম', 'Salma Begum', '9876543210123',
 'বাড়ি-৫, রোড-৩, মিরপুর-১০, ঢাকা',
 'processing', 50.00, 4,
 NULL, NULL),

-- Application 4: pending (unverified user)
(3, 'TRK-2024-000004',
 'নাফিসা করিম', 'Nafisa Karim', '2024-02-14', 'Chittagong Medical College Hospital', 'female',
 'করিম হোসেন', 'Karim Hossain', '3334445556667',
 'রুমানা আক্তার', 'Rumana Akter', '7778889990001',
 'পাহাড়তলী, চট্টগ্রাম',
 'pending', 50.00, NULL,
 NULL, NULL),

-- Application 5: rejected
(2, 'TRK-2024-000005',
 'ইমরান শেখ', 'Imran Sheikh', '2023-08-30', 'Dhaka Medical College Hospital', 'male',
 'করিম শেখ', 'Karim Sheikh', '1112223334445',
 'ফাতেমা বেগম', 'Fatema Begum', '5556667778889',
 'বাড়ি-১২, সেক্টর-৭, উত্তরা, ঢাকা',
 'rejected', 50.00, 5,
 NULL, NULL);

-- Rejection reason update
UPDATE applications SET rejection_reason = 'NID তথ্য সঠিক নয়। পিতার NID নম্বর যাচাই করা যায়নি।'
WHERE tracking_id = 'TRK-2024-000005';


-- =============================================
-- DOCUMENTS
-- =============================================
INSERT INTO documents (app_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) VALUES
(1, 'hospital_certificate', 'hospital_cert_001.pdf',  '/uploads/docs/hospital_cert_001.pdf',  204800, 'application/pdf', 1),
(1, 'father_nid',           'father_nid_001.jpg',     '/uploads/docs/father_nid_001.jpg',      102400, 'image/jpeg',      1),
(1, 'mother_nid',           'mother_nid_001.jpg',     '/uploads/docs/mother_nid_001.jpg',       98304, 'image/jpeg',      1),
(2, 'hospital_certificate', 'hospital_cert_002.pdf',  '/uploads/docs/hospital_cert_002.pdf',  215040, 'application/pdf', 2),
(2, 'father_nid',           'father_nid_002.jpg',     '/uploads/docs/father_nid_002.jpg',      110592, 'image/jpeg',      2),
(3, 'hospital_certificate', 'hospital_cert_003.pdf',  '/uploads/docs/hospital_cert_003.pdf',  198656, 'application/pdf', 1),
(4, 'hospital_certificate', 'hospital_cert_004.pdf',  '/uploads/docs/hospital_cert_004.pdf',  220160, 'application/pdf', 3),
(5, 'hospital_certificate', 'hospital_cert_005.pdf',  '/uploads/docs/hospital_cert_005.pdf',  189440, 'application/pdf', 2),
(5, 'father_nid',           'father_nid_005.jpg',     '/uploads/docs/father_nid_005.jpg',       92160, 'image/jpeg',      2);


-- =============================================
-- PAYMENTS
-- =============================================
INSERT INTO payments (app_id, user_id, transaction_id, amount, payment_method, payment_status, paid_at) VALUES
(1, 1, 'BKASH-20240201-001', 50.00, 'bkash',  'success',  '2024-02-01 11:00:00'),
(2, 2, 'NAGAD-20240305-002', 50.00, 'nagad',  'success',  '2024-03-05 10:15:00'),
(3, 1, 'BKASH-20240310-003', 50.00, 'bkash',  'success',  '2024-03-10 09:45:00'),
(4, 3, NULL,                  50.00, 'bkash',  'pending',  NULL),
(5, 2, 'BKASH-20240401-005', 50.00, 'bkash',  'success',  '2024-04-01 08:30:00');


-- =============================================
-- NOTIFICATIONS
-- =============================================
INSERT INTO notifications (user_id, app_id, title, message, type, status, is_read) VALUES
(1, 1, 'আবেদন সম্পন্ন হয়েছে',    'আপনার জন্ম নিবন্ধন সনদ (TRK-2024-000001) প্রস্তুত। অফিস থেকে সংগ্রহ করুন।', 'app', 'sent', TRUE),
(1, 1, 'পেমেন্ট সফল',            'TRK-2024-000001 আবেদনের জন্য ৳৫০ পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে।',         'sms', 'sent', TRUE),
(2, 2, 'আবেদন অনুমোদিত হয়েছে',  'আপনার জন্ম নিবন্ধন আবেদন (TRK-2024-000002) অনুমোদন করা হয়েছে।',            'app', 'sent', FALSE),
(1, 3, 'আবেদন প্রক্রিয়াধীন',    'আপনার আবেদন (TRK-2024-000003) যাচাই করা হচ্ছে।',                             'app', 'sent', FALSE),
(3, 4, 'আবেদন জমা হয়েছে',       'আপনার জন্ম নিবন্ধন আবেদন (TRK-2024-000004) সফলভাবে জমা হয়েছে।',            'app', 'sent', TRUE),
(2, 5, 'আবেদন বাতিল হয়েছে',     'আপনার আবেদন (TRK-2024-000005) বাতিল করা হয়েছে। কারণ: NID তথ্য সঠিক নয়।',  'app', 'sent', TRUE);


-- =============================================
-- APPLICATION STATUS HISTORY
-- =============================================
INSERT INTO application_status_history (app_id, old_status, new_status, changed_by, remarks) VALUES
(1, NULL,         'pending',    1, 'আবেদন জমা দেওয়া হয়েছে'),
(1, 'pending',    'processing', 4, 'নথিপত্র যাচাই শুরু হয়েছে'),
(1, 'processing', 'verified',   4, 'সকল তথ্য সঠিক পাওয়া গেছে'),
(1, 'verified',   'approved',   4, 'অনুমোদন দেওয়া হয়েছে'),
(1, 'approved',   'completed',  4, 'সনদ প্রস্তুত ও প্রদান করা হয়েছে'),

(2, NULL,         'pending',    2, 'আবেদন জমা দেওয়া হয়েছে'),
(2, 'pending',    'processing', 5, 'নথিপত্র যাচাই শুরু হয়েছে'),
(2, 'processing', 'approved',   5, 'অনুমোদন দেওয়া হয়েছে'),

(3, NULL,         'pending',    1, 'আবেদন জমা দেওয়া হয়েছে'),
(3, 'pending',    'processing', 4, 'নথিপত্র যাচাই শুরু হয়েছে'),

(4, NULL,         'pending',    3, 'আবেদন জমা দেওয়া হয়েছে'),

(5, NULL,         'pending',    2, 'আবেদন জমা দেওয়া হয়েছে'),
(5, 'pending',    'processing', 5, 'নথিপত্র যাচাই শুরু হয়েছে'),
(5, 'processing', 'rejected',   5, 'NID তথ্য যাচাই ব্যর্থ হয়েছে');


-- =============================================
-- FEEDBACK & COMPLAINTS
-- =============================================
INSERT INTO feedback_complaints (user_id, app_id, type, category, subject, description, status, assigned_to, resolution_note, resolved_at) VALUES
(1, 1, 'feedback',   'Service Quality', 'দ্রুত সেবার জন্য ধন্যবাদ', 'আবেদন প্রক্রিয়া অনেক সহজ ও দ্রুত ছিল। অফিসারগণ সহযোগিতামূলক ছিলেন।', 'resolved', 4, 'ধন্যবাদ আপনার মতামতের জন্য।', '2024-02-25 10:00:00'),
(2, 5, 'complaint',  'Application',     'ভুল কারণে আবেদন বাতিল',    'আমার পিতার NID সঠিক ছিল, তবুও আবেদন বাতিল করা হয়েছে। পুনর্বিবেচনার অনুরোধ।', 'in_review', 5, NULL, NULL),
(3, 4, 'feedback',   'System',          'পেমেন্ট সিস্টেম উন্নত করুন', 'bKash পেমেন্টে সমস্যা হচ্ছিল। আরও পেমেন্ট অপশন যোগ করলে ভালো হতো।', 'pending', NULL, NULL, NULL);


-- =============================================
-- AUDIT LOGS
-- =============================================
INSERT INTO audit_logs (user_id, action, target_type, target_id, ip_address, details) VALUES
(1, 'LOGIN',              'user',        1, '103.100.200.50', JSON_OBJECT('method', 'mobile_otp')),
(1, 'APPLICATION_SUBMIT', 'application', 1, '103.100.200.50', JSON_OBJECT('tracking_id', 'TRK-2024-000001')),
(1, 'PAYMENT_SUCCESS',    'payment',     1, '103.100.200.50', JSON_OBJECT('transaction_id', 'BKASH-20240201-001', 'amount', 50)),
(4, 'LOGIN',              'user',        4, '10.0.0.5',       JSON_OBJECT('method', 'password')),
(4, 'STATUS_CHANGE',      'application', 1, '10.0.0.5',       JSON_OBJECT('old_status', 'pending', 'new_status', 'processing')),
(4, 'STATUS_CHANGE',      'application', 1, '10.0.0.5',       JSON_OBJECT('old_status', 'processing', 'new_status', 'approved')),
(5, 'STATUS_CHANGE',      'application', 5, '10.0.0.8',       JSON_OBJECT('old_status', 'processing', 'new_status', 'rejected')),
(6, 'LOGIN',              'user',        6, '192.168.1.1',    JSON_OBJECT('method', 'password')),
(6, 'USER_VERIFIED',      'user',        3, '192.168.1.1',    JSON_OBJECT('action', 'manual_verify'));
