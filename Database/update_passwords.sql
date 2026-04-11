USE scst_db;

-- =============================================
-- PASSWORD HASH UPDATE
-- Officer@123 এবং Admin@123 দিয়ে login করা যাবে
-- =============================================

-- Citizen users (password: 123456)
UPDATE users SET password_hash = '$2b$10$n/x0PDjNDxnGg1Rw0cLrUupHObThqqDjKCrcFrBqMQg2tKMQpAy72'
WHERE mobile IN ('01711111111', '01722222222', '01733333333');

-- Officer users (password: Officer@123)
UPDATE users SET password_hash = '$2b$10$Xl1WDhXWFDd/hQGmrd6p5uQKq9J3vx7IuCV.NacD8U4f4PsCUM2jK'
WHERE mobile IN ('01744444444', '01755555555');

-- Admin user (password: Admin@123)
UPDATE users SET password_hash = '$2b$10$CVYA70yuOXt0TeIHTvE7V.RO9TqEV4Gx/4r388QQFatALKgcJhmxG'
WHERE mobile = '01766666666';

-- =============================================
-- VERIFY করো
-- =============================================
SELECT user_id, name, mobile, role, 
       LEFT(password_hash, 20) AS hash_preview
FROM users
ORDER BY user_id;
