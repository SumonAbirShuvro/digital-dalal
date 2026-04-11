USE scst_db;

-- =============================================
-- পুরনো sample data মুছে ফেলো
-- এরপর থেকে শুধু নতুন real applications দেখাবে
-- =============================================

-- আগে documents মুছো (foreign key constraint)
DELETE FROM documents WHERE app_id IN (
    SELECT app_id FROM applications WHERE YEAR(submitted_at) < 2026
);

-- payments মুছো
DELETE FROM payments WHERE app_id IN (
    SELECT app_id FROM applications WHERE YEAR(submitted_at) < 2026
);

-- application_status_history মুছো
DELETE FROM application_status_history WHERE app_id IN (
    SELECT app_id FROM applications WHERE YEAR(submitted_at) < 2026
);

-- notifications মুছো
DELETE FROM notifications WHERE app_id IN (
    SELECT app_id FROM applications WHERE YEAR(submitted_at) < 2026
);

-- এখন applications মুছো
DELETE FROM applications WHERE YEAR(submitted_at) < 2026;

-- ✅ Verify — এখন খালি হওয়া উচিত
SELECT COUNT(*) AS remaining_applications FROM applications;
