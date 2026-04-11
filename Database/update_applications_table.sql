USE scst_db;

-- =============================================
-- STEP 1: পুরনো NID columns বাদ দাও
-- =============================================
ALTER TABLE applications
    DROP COLUMN IF EXISTS father_nid,
    DROP COLUMN IF EXISTS mother_nid;

-- =============================================
-- STEP 2: নতুন columns যোগ করো
-- =============================================
ALTER TABLE applications
   
    ADD COLUMN father_nationality VARCHAR(50)  AFTER father_name_en,
   
    ADD COLUMN mother_nationality VARCHAR(50)  AFTER mother_name_en;

-- =============================================
-- STEP 3: service_type column নিশ্চিত করো
-- =============================================
ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'birth_certificate';

UPDATE applications SET service_type = 'birth_certificate' WHERE service_type IS NULL;

-- =============================================
-- VERIFY
-- =============================================
DESCRIBE applications;
