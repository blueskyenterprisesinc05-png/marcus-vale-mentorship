-- Create custom type for application status
CREATE TYPE application_status AS ENUM ('new', 'reviewing', 'accepted', 'declined');

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  experience TEXT NOT NULL,
  market TEXT NOT NULL,
  challenge TEXT NOT NULL,
  process TEXT NOT NULL,
  goal TEXT NOT NULL,
  commitment TEXT NOT NULL,
  status application_status DEFAULT 'new' NOT NULL,
  notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, sent, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for both tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
-- Allow anonymous inserts (anyone can apply)
CREATE POLICY "Allow public inserts" ON applications
  FOR INSERT WITH CHECK (true);

-- Restrict read/write/delete queries to authenticated admin users only
CREATE POLICY "Allow admin select" ON applications
  FOR SELECT USING (auth.role() = 'service_role' OR auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'blues@example.com' -- Replace with reviewer's real admin email or meta claim
  ));

CREATE POLICY "Allow admin update" ON applications
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'blues@example.com'
  ));

CREATE POLICY "Allow admin delete" ON applications
  FOR DELETE USING (auth.role() = 'service_role' OR auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'blues@example.com'
  ));

-- RLS Policies for notifications
-- Notifications are internal and should only be readable/writable by admin/service role
CREATE POLICY "Allow service role access" ON notifications
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);
