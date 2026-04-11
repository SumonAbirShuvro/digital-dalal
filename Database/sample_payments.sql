USE scst_db;

-- =============================================
-- PAYMENTS (updated with UddoktaPay columns)
-- =============================================
-- পুরনো payment data মুছো
DELETE FROM payments WHERE app_id IN (1,2,3,4,5);

INSERT INTO payments (
    app_id, user_id,
    invoice_id, transaction_id,
    amount, currency, payment_method, payment_status,
    service_name, customer_name, customer_mobile, customer_email,
    paid_at, verified_at
) VALUES
(1, 1,
 'INV-2024-001', 'BKASH-20240201-001',
 50.00, 'BDT', 'bkash', 'paid',
 'Birth Certificate', 'Rahim Uddin', '01711111111', 'rahim@gmail.com',
 '2024-02-01 11:00:00', '2024-02-01 11:02:00'),

(2, 2,
 'INV-2024-002', 'NAGAD-20240305-002',
 50.00, 'BDT', 'nagad', 'paid',
 'Birth Certificate', 'Fatema Begum', '01722222222', 'fatema@gmail.com',
 '2024-03-05 10:15:00', '2024-03-05 10:16:00'),

(3, 1,
 'INV-2024-003', 'BKASH-20240310-003',
 50.00, 'BDT', 'bkash', 'paid',
 'Birth Certificate', 'Rahim Uddin', '01711111111', 'rahim@gmail.com',
 '2024-03-10 09:45:00', '2024-03-10 09:46:00'),

(4, 3,
 'INV-2024-004', NULL,
 50.00, 'BDT', 'bkash', 'pending',
 'Birth Certificate', 'Karim Hossain', '01733333333', 'karim@gmail.com',
 NULL, NULL),

(5, 2,
 'INV-2024-005', 'BKASH-20240401-005',
 50.00, 'BDT', 'bkash', 'paid',
 'Birth Certificate', 'Fatema Begum', '01722222222', 'fatema@gmail.com',
 '2024-04-01 08:30:00', '2024-04-01 08:31:00');
