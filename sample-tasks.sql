
-- Sample tasks for different plan levels
INSERT INTO tasks (title, description, reward, plan_required, task_type, is_active, created_by) VALUES
('Social Media Engagement', 'Like and share our latest post on Instagram. Screenshot proof required.', 500, NULL, 'daily_task', true, 1),
('Product Review', 'Write a detailed review of our product on your preferred platform.', 1000, 'lite', 'daily_task', true, 1),
('Video Watch Task', 'Watch our promotional video and leave a comment with your thoughts.', 750, NULL, 'daily_task', true, 1),
('Referral Challenge', 'Refer 3 new users this week and earn a bonus reward.', 3000, 'standard', 'daily_task', true, 1),
('Content Creation', 'Create a short video promoting our platform (30-60 seconds).', 2500, 'premium', 'daily_task', true, 1),
('Survey Completion', 'Complete our user experience survey (10 questions).', 800, NULL, 'daily_task', true, 1),
('Community Engagement', 'Answer 5 questions in our community forum to help new members.', 1200, 'standard', 'daily_task', true, 1),
('Newsletter Sharing', 'Share our weekly newsletter with your network via email or social media.', 600, 'lite', 'daily_task', true, 1),
('App Testing', 'Test our new feature and provide feedback on usability.', 1500, 'premium', 'daily_task', true, 1),
('Daily Check-in', 'Log in and complete your daily check-in for streak bonus.', 400, NULL, 'daily_task', true, 1);
