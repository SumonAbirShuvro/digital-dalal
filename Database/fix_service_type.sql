USE scst_db;

-- applications table এ service_type column আছে কিনা চেক করো
-- না থাকলে যোগ করো, থাকলে update করো

-- ✅ Step 1: service_type column যোগ করো (না থাকলে)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'birth_certificate';

-- ✅ Step 2: যেসব applications এ service_type NULL আছে সেগুলো update করো
UPDATE applications 
SET service_type = 'birth_certificate' 
WHERE service_type IS NULL OR service_type = '';

-- Verify
SELECT app_id, tracking_id, service_type, status FROM applications;
