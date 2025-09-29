-- SQL Script to create tables for MCQ Quizzes and Questions
-- Run this in phpMyAdmin or MySQL console after selecting the database (e.g., notesvault_db if it exists; create one if needed)


-- Table for Quizzes
CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for MCQs (Questions)
CREATE TABLE mcqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_quiz_user ON quizzes(user_id);
CREATE INDEX idx_mcq_quiz ON mcqs(quiz_id);

-- Example insert (optional, for testing - assumes user_id 1 exists; insert a user first if needed)
-- INSERT INTO users (username, email, password) VALUES ('testuser', 'test@example.com', 'hashed_password');
-- INSERT INTO quizzes (user_id, name, description) VALUES (1, 'Sample Quiz', 'A test quiz');
-- INSERT INTO mcqs (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) 
-- VALUES (1, 'What is 2+2?', '3', '4', '5', '6', 'B');
-- VALUES (1, 'What is 2+2?', '3', '4', '5', '6', 'B');
