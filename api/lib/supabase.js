import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Forms will work but data won\'t be stored.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper function to safely insert data
export async function insertLead(leadData) {
  if (!supabase) {
    console.log('Supabase not configured. Lead data:', leadData);
    return { data: null, error: null, warning: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error inserting lead:', error);
    return { data: null, error: error.message };
  }
}

// Helper function to track assessments
export async function createAssessment(leadId, assessmentType) {
  if (!supabase) {
    console.log('Supabase not configured. Assessment:', { leadId, assessmentType });
    return { data: null, error: null, warning: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([{
        lead_id: leadId,
        assessment_type: assessmentType,
        status: 'pending',
        score: null,
        vulnerabilities: {},
        recommendations: {}
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating assessment:', error);
    return { data: null, error: error.message };
  }
}

export default supabase;