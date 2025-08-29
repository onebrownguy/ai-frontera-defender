// Vercel Serverless Function for Form Submissions
// Integrated with Supabase for secure data storage

import { insertLead, createAssessment } from './lib/supabase.js';

export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins during development
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    const formType = formData.formType || 'contact';

    // Validate required fields based on form type
    const requiredFields = {
      signup: ['email', 'company', 'companySize'],
      demo: ['firstName', 'lastName', 'email', 'company'],
      contact: ['firstName', 'lastName', 'email', 'company', 'message']
    };

    const required = requiredFields[formType] || requiredFields.contact;
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        fields: missing 
      });
    }

    // Prepare lead data for database
    const leadData = {
      form_type: formType,
      email: formData.email,
      company: formData.company,
      first_name: formData.firstName || null,
      last_name: formData.lastName || null,
      company_size: formData.companySize || null,
      job_title: formData.jobTitle || null,
      phone: formData.phone || null,
      message: formData.message || null,
      ai_usage: formData.aiUsage || null,
      concerns: formData.concerns || null,
      timeline: formData.timeline || null,
      budget: formData.budget || null,
      challenges: formData.challenges || null,
      metadata: formData,
      source: 'website',
      created_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { data: lead, error, warning } = await insertLead(leadData);

    if (warning) {
      // Database not configured, but form submission successful
      console.log('Form submitted (no database):', leadData);
      return res.status(200).json({ 
        success: true,
        message: 'Form submitted successfully (pending database setup)',
        formType: formType,
        warning: warning
      });
    }

    if (error) {
      console.error('Database error:', error);
      // Still return success to user, log error internally
      return res.status(200).json({ 
        success: true,
        message: 'Form submitted successfully',
        formType: formType
      });
    }

    // If signup form, create assessment record
    if (formType === 'signup' && lead && lead.id) {
      await createAssessment(lead.id, 'free_assessment');
    }

    // Send success response
    return res.status(200).json({ 
      success: true,
      message: 'Form submitted successfully',
      formType: formType,
      leadId: lead?.id
    });

  } catch (error) {
    console.error('Form submission error:', error);
    // Don't expose internal errors to user
    return res.status(200).json({ 
      success: true,
      message: 'Form submitted successfully',
      formType: req.body.formType || 'contact'
    });
  }
}