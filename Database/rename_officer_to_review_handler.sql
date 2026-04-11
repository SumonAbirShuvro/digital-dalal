USE scst_db;

-- =============================================
-- STEP 1: users table এর role ENUM update
-- officer → review_handler
-- =============================================

ALTER TABLE users 
MODIFY COLUMN role ENUM('citizen', 'review_handler', 'admin') DEFAULT 'citizen';

-- =============================================
-- STEP 2: existing officer users এর role update
-- =============================================

UPDATE users 
SET role = 'review_handler' 
WHERE role = 'officer';

-- =============================================
-- STEP 3: officers table টা এখন review_handlers
-- (table rename optional — backend route একই থাকবে)
-- =============================================

-- Verify
SELECT user_id, name, mobile, role FROM users ORDER BY role;
