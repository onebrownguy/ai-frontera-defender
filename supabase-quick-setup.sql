-- AI Capital Defender - Supabase Database Setup
-- Run this entire script in your Supabase SQL Editor
-- Go to: https://app.supabase.com/project/[your-project]/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table for all form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_size VARCHAR(50),
  job_title VARCHAR(100),
  phone VARCHAR(50),
  message TEXT,
  ai_usage VARCHAR(100),
  concerns TEXT,
  timeline VARCHAR(50),
  budget VARCHAR(50),
  challenges TEXT,
  metadata JSONB,
  source VARCHAR(100) DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table for tracking security assessments
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  assessment_type VARCHAR(100),
  score INTEGER,
  vulnerabilities JSONB,
  recommendations JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_form_type ON leads(form_type);
CREATE INDEX IF NOT EXISTS idx_assessments_lead_id ON assessments(lead_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow the service role to manage all data
CREATE POLICY "Service role can manage all leads" ON leads
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all assessments" ON assessments
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create a view for lead statistics
CREATE OR REPLACE VIEW lead_stats AS
SELECT 
  COUNT(*) as total_leads,
  COUNT(DISTINCT company) as unique_companies,
  COUNT(CASE WHEN form_type = 'signup' THEN 1 END) as signups,
  COUNT(CASE WHEN form_type = 'demo' THEN 1 END) as demos,
  COUNT(CASE WHEN form_type = 'contact' THEN 1 END) as contacts,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7d,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30d
FROM leads;

-- Create a view for company insights
CREATE OR REPLACE VIEW company_insights AS
SELECT 
  company,
  COUNT(*) as submission_count,
  ARRAY_AGG(DISTINCT form_type) as form_types,
  MIN(created_at) as first_contact,
  MAX(created_at) as last_contact,
  COUNT(DISTINCT email) as unique_contacts
FROM leads
WHERE company IS NOT NULL
GROUP BY company
ORDER BY submission_count DESC;

-- Grant permissions for views
GRANT SELECT ON lead_stats TO authenticated;
GRANT SELECT ON company_insights TO authenticated;

-- Success message
SELECT 'Supabase setup complete! Your database is ready for AI Capital Defender.' as message;