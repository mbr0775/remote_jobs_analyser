'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://orxbfzrudpsdqoiolmri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeGJmenJ1ZHBzZHFvaW9sbXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkwNzEsImV4cCI6MjA3NDA1NTA3MX0.OZVNJgfdEazDB9H7XRgN4ESUs3XdX0k2uLKK-HOK1jc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AddCompanyModal({ addCompany, setShowAddCompany }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      
      // Prepare the company data according to your database schema
      const companyData = {
        name: formData.get('name'),
        job_title: formData.get('jobTitle') || null,
        job_type: formData.get('jobType') || null,
        industry: formData.get('industry') || null,
        size: formData.get('size') || null,
        founded: formData.get('founded') || null,
        location: formData.get('location') || null,
        website: formData.get('website') || null,
        phone: formData.get('phone') || null,
        email: formData.get('email') || null,
        status: formData.get('status'),
        job_description: formData.get('description') || null,
        resume_deadline_date: formData.get('resumeDeadline') || null,
        contacted: false,
        applied: false,
        created_at: new Date().toISOString()
      };

      // Insert data into Supabase
      const { data, error: supabaseError } = await supabase
        .from('companies')
        .insert([companyData])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('Company added successfully:', data);
      
      // Call the parent callback with the new company data
      if (addCompany && data && data.length > 0) {
        addCompany(data[0]);
      }

      // Reset form and close modal
      e.target.reset();
      setShowAddCompany(false);
      
      // Optional: Show success message
      alert('Company added successfully!');

    } catch (err) {
      console.error('Error adding company:', err);
      setError(err.message || 'Failed to add company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/30 backdrop-blur-lg flex items-center justify-center z-50" style={{
      backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:0.3" /><stop offset="50%" style="stop-color:%23764ba2;stop-opacity:0.2" /><stop offset="100%" style="stop-color:%23f093fb;stop-opacity:0.3" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23grad1)"/><circle cx="200" cy="200" r="150" fill="%23ffffff" opacity="0.1"/><circle cx="800" cy="300" r="100" fill="%23ffffff" opacity="0.05"/><circle cx="300" cy="700" r="120" fill="%23ffffff" opacity="0.08"/><circle cx="700" cy="800" r="80" fill="%23ffffff" opacity="0.06"/></svg>')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-black">Add New Company</h2>
          <button 
            onClick={() => setShowAddCompany(false)} 
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving company...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company Name *</label>
            <input 
              name="name" 
              placeholder="Enter company name" 
              required 
              maxLength={255}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Title</label>
            <input 
              name="jobTitle" 
              placeholder="e.g. Software Developer, Data Analyst" 
              maxLength={255}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Type</label>
            <select 
              name="jobType" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select job type</option>
              <option value="Remote" className="text-gray-900">Remote</option>
              <option value="Onsite" className="text-gray-900">Onsite</option>
              <option value="Hybrid" className="text-gray-900">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Industry</label>
            <select 
              name="industry" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select industry</option>
              <option value="Aerospace & Defense" className="text-gray-900">Aerospace & Defense</option>
              <option value="Agriculture & Food" className="text-gray-900">Agriculture & Food</option>
              <option value="Automotive" className="text-gray-900">Automotive</option>
              <option value="Aviation" className="text-gray-900">Aviation</option>
              <option value="Banking & Finance" className="text-gray-900">Banking & Finance</option>
              <option value="Biotechnology" className="text-gray-900">Biotechnology</option>
              <option value="Construction & Real Estate" className="text-gray-900">Construction & Real Estate</option>
              <option value="Consulting" className="text-gray-900">Consulting</option>
              <option value="E-commerce" className="text-gray-900">E-commerce</option>
              <option value="Education" className="text-gray-900">Education</option>
              <option value="Energy & Utilities" className="text-gray-900">Energy & Utilities</option>
              <option value="Engineering" className="text-gray-900">Engineering</option>
              <option value="Entertainment & Media" className="text-gray-900">Entertainment & Media</option>
              <option value="Financial Services" className="text-gray-900">Financial Services</option>
              <option value="Government & Public Sector" className="text-gray-900">Government & Public Sector</option>
              <option value="Healthcare" className="text-gray-900">Healthcare</option>
              <option value="Hospitality & Tourism" className="text-gray-900">Hospitality & Tourism</option>
              <option value="Insurance" className="text-gray-900">Insurance</option>
              <option value="Internet & Technology" className="text-gray-900">Internet & Technology</option>
              <option value="Legal Services" className="text-gray-900">Legal Services</option>
              <option value="Logistics & Transportation" className="text-gray-900">Logistics & Transportation</option>
              <option value="Manufacturing" className="text-gray-900">Manufacturing</option>
              <option value="Marketing & Advertising" className="text-gray-900">Marketing & Advertising</option>
              <option value="Mining & Metals" className="text-gray-900">Mining & Metals</option>
              <option value="Non-profit" className="text-gray-900">Non-profit</option>
              <option value="Oil & Gas" className="text-gray-900">Oil & Gas</option>
              <option value="Pharmaceuticals" className="text-gray-900">Pharmaceuticals</option>
              <option value="Retail" className="text-gray-900">Retail</option>
              <option value="Software Development" className="text-gray-900">Software Development</option>
              <option value="Sports & Recreation" className="text-gray-900">Sports & Recreation</option>
              <option value="Technology Consulting" className="text-gray-900">Technology Consulting</option>
              <option value="Telecommunications" className="text-gray-900">Telecommunications</option>
              <option value="Textiles & Apparel" className="text-gray-900">Textiles & Apparel</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company Size</label>
            <select 
              name="size" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select company size</option>
              <option value="1-10" className="text-gray-900">1-10</option>
              <option value="11-50" className="text-gray-900">11-50</option>
              <option value="51-200" className="text-gray-900">51-200</option>
              <option value="201-500" className="text-gray-900">201-500</option>
              <option value="501-1000" className="text-gray-900">501-1000</option>
              <option value="1001-5000" className="text-gray-900">1001-5000</option>
              <option value="5000+" className="text-gray-900">5000+</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Founded Year</label>
            <input 
              name="founded" 
              placeholder="e.g. 2020" 
              maxLength={10}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input 
              name="location" 
              placeholder="City, State/Country" 
              maxLength={255}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Website</label>
            <input 
              name="website" 
              type="url"
              placeholder="https://company.com" 
              maxLength={500}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input 
              name="phone" 
              type="tel"
              placeholder="+974-xxxx-xxxx" 
              maxLength={50}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact Email</label>
            <input 
              name="email" 
              type="email"
              placeholder="hr@company.com" 
              maxLength={255}
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Resume Deadline</label>
            <input 
              name="resumeDeadline" 
              type="date"
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Status *</label>
            <select 
              name="status" 
              required
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="Active" className="text-gray-900">Active</option>
              <option value="Partnered" className="text-gray-900">Partnered</option>
              <option value="Prospective" className="text-gray-900">Prospective</option>
              <option value="Applied" className="text-gray-900">Applied</option>
              <option value="Interviewed" className="text-gray-900">Interviewed</option>
              <option value="Not Interested" className="text-gray-900">Not Interested</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea 
              name="description" 
              placeholder="Brief description of the company..." 
              rows="3" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setShowAddCompany(false)} 
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Add Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}