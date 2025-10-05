-- Add description column to files table for better AI search
ALTER TABLE files ADD COLUMN IF NOT EXISTS description TEXT;

-- Add welcome_message settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default welcome message
INSERT INTO settings (key, value) 
VALUES ('welcome_message', 'Привет! 👋 Я помощник Богдан. Задавайте мне вопросы, и я отвечу на основе загруженных документов.')
ON CONFLICT (key) DO NOTHING;
