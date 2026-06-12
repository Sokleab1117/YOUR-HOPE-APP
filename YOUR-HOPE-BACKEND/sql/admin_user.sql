- ═══════════════════════════════════════════════════════════════════
--  YOUR HOPE — admin_user.sql
--  Promotes an existing user to admin role.
--
--  Run:  mysql -u root -p your_hope_db < sql/admin_user.sql
--  Or paste directly into the mysql> console.
-- ═══════════════════════════════════════════════════════════════════
 
USE your_hope_db;
 
-- Replace the email below with the account you signed up with
UPDATE users
SET role = 'admin'
WHERE email = 'nysarakseyha@gmail.com';
 
-- Verify the change
SELECT user_id, full_name, email, role, status, created_at
FROM users;
 