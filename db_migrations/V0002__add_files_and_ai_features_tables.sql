-- Create files table for document storage
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  content TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(200)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_files_session ON files(session_id);

-- Create AI features table for tracking usage
CREATE TABLE IF NOT EXISTS ai_features (
  id SERIAL PRIMARY KEY,
  feature_name VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial AI features
INSERT INTO ai_features (feature_name, usage_count) VALUES
  ('chat', 0),
  ('image_generation', 0),
  ('document_analysis', 0),
  ('file_upload', 0)
ON CONFLICT DO NOTHING;