-- Create tracks table
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration TEXT,
  "durationSeconds" INTEGER,
  side TEXT,
  speed TEXT,
  format TEXT,
  "grooveLabel" TEXT,
  "recordingNotes" TEXT,
  "venueOrStudio" TEXT,
  year TEXT,
  "coverUrl" TEXT,
  "audioBlobUrl" TEXT,
  "hasCustomAudio" BOOLEAN,
  chords JSONB,
  "createdAt" BIGINT
);

-- Create content table (key-value)
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- Create posts table
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  date TEXT,
  content TEXT,
  "imageUrl" TEXT,
  "createdAt" BIGINT
);

-- Make them public read
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "public_read_content" ON content FOR SELECT USING (true);
CREATE POLICY "public_read_posts" ON posts FOR SELECT USING (true);

-- Allow full access for service role (our server uses service_role key)
-- Service role bypasses RLS automatically.

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
CREATE POLICY "public_media_access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
