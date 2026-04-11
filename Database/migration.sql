-- Run this in your MySQL database if current_address column doesn't exist

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS current_address VARCHAR(255) DEFAULT NULL;

-- Make sure role column supports all three values
ALTER TABLE users 
MODIFY COLUMN role ENUM('citizen', 'admin', 'officer') DEFAULT 'citizen';
