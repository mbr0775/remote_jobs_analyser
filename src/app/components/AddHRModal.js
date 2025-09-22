'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://vijkyxwhfijdxmeizwzw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpamt5eHdoZmlqZHhtZWl6d3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjI1NjUsImV4cCI6MjA3Mjg5ODU2NX0.9usmCPahHk2qCQezIKWUz4gQ3zYsFJ4vALu9WveuaO4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AddHRModal({ addHR, setShowAddHR, companies }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      
      // Create HR object with exact field names to match database schema
      const newHR = {
        name: formData.get('name'),
        job_title: formData.get('jobTitle'),
        company: formData.get('company'),
        department: formData.get('department'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        linkedin: formData.get('linkedin'),
        authority: formData.get('authority'),
        status: formData.get('status'),
        specializations: formData.get('specializations'),
        notes: formData.get('notes'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert into Supabase
      const { data, error: supabaseError } = await supabase
        .from('hrs')
        .insert([newHR])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Call the parent component's addHR function with the returned data
      if (data && data.length > 0) {
        await addHR(data[0]);
      }

      setShowAddHR(false);
      e.target.reset();
    } catch (err) {
      console.error('Error adding HR contact:', err);
      setError(`Failed to add HR contact: ${err.message || 'Please try again.'}`);
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
          <h2 className="font-bold text-lg text-black">Add New HR Contact</h2>
          <button 
            onClick={() => setShowAddHR(false)} 
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
            Adding HR contact...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
            <input 
              name="name" 
              placeholder="John Doe" 
              required 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Title</label>
            <input 
              name="jobTitle" 
              placeholder="HR Manager" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company *</label>
            <select 
              name="company" 
              required 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select company</option>
              {companies && companies.map((c) => (
                <option key={c.id || c.name} value={c.name} className="text-gray-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Department</label>
            <select 
              name="department" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select department</option>
              <option value="Human Resources" className="text-gray-900">Human Resources</option>
              <option value="Talent Acquisition" className="text-gray-900">Talent Acquisition</option>
              <option value="Recruitment" className="text-gray-900">Recruitment</option>
              <option value="People Operations" className="text-gray-900">People Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input 
              name="email" 
              type="email"
              placeholder="john.doe@company.com" 
              required 
              disabled={loading}
              maxLength={255}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input 
              name="phone" 
              type="tel"
              placeholder="+1-555-0123" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile</label>
            <input 
              name="linkedin" 
              type="url"
              placeholder="https://linkedin.com/in/username" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Hiring Authority</label>
            <select 
              name="authority" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select authority level</option>
              <option value="Full Authority" className="text-gray-900">Full Authority</option>
              <option value="Limited Authority" className="text-gray-900">Limited Authority</option>
              <option value="Skill Authority" className="text-gray-900">Skill Authority</option>
              <option value="Decision Influencer" className="text-gray-900">Decision Influencer</option>
              <option value="Screening Only" className="text-gray-900">Screening Only</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select 
              name="status" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="Active" className="text-gray-900">Active</option>
              <option value="Responsive" className="text-gray-900">Responsive</option>
              <option value="Contacted" className="text-gray-900">Contacted</option>
              <option value="Not Responsive" className="text-gray-900">Not Responsive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Specializations</label>
            <input 
              name="specializations" 
              placeholder="e.g., Software Development, IT Support, Data Analysis" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Notes</label>
            <textarea 
              name="notes" 
              placeholder="Additional notes about this contact..." 
              rows="3" 
              disabled={loading}
              className="w-full border border-gray-300 p-2 rounded-md placeholder:text-gray-400 text-gray-900 focus:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setShowAddHR(false)} 
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
                  Adding...
                </>
              ) : (
                'Add Contact'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}