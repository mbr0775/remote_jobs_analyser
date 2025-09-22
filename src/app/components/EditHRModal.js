// components/EditHRModal.js
'use client';

export default function EditHRModal({ editHR, editingHR, setEditingHR, companies }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/30 backdrop-blur-lg flex items-center justify-center" style={{
      backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:0.3" /><stop offset="50%" style="stop-color:%23764ba2;stop-opacity:0.2" /><stop offset="100%" style="stop-color:%23f093fb;stop-opacity:0.3" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23grad1)"/><circle cx="200" cy="200" r="150" fill="%23ffffff" opacity="0.1"/><circle cx="800" cy="300" r="100" fill="%23ffffff" opacity="0.05"/><circle cx="300" cy="700" r="120" fill="%23ffffff" opacity="0.08"/><circle cx="700" cy="800" r="80" fill="%23ffffff" opacity="0.06"/></svg>')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-black">Edit HR Contact</h2>
          <button onClick={() => setEditingHR(null)} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedHR = {
              id: editingHR.id,
              name: formData.get('name'),
              jobTitle: formData.get('jobTitle'),
              company: formData.get('company'),
              department: formData.get('department'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              linkedin: formData.get('linkedin'),
              authority: formData.get('authority'),
              status: formData.get('status'),
              specializations: formData.get('specializations'),
              notes: formData.get('notes'),
              contacted: editingHR.contacted,
              createdAt: editingHR.createdAt,
            };
            editHR(updatedHR);
            setEditingHR(null);
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
            <input name="name" defaultValue={editingHR.name} required className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Title</label>
            <input name="jobTitle" defaultValue={editingHR.jobTitle} className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company *</label>
            <select name="company" defaultValue={editingHR.company} required className="w-full border border-gray-300 p-2 rounded-md text-gray-700">
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Department</label>
            <select name="department" defaultValue={editingHR.department} className="w-full border border-gray-300 p-2 rounded-md text-gray-700">
              <option value="">Select department</option>
              <option>Human Resources</option>
              <option>Talent Acquisition</option>
              <option>Recruitment</option>
              <option>People Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input name="email" defaultValue={editingHR.email} required className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input name="phone" defaultValue={editingHR.phone} className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile</label>
            <input name="linkedin" defaultValue={editingHR.linkedin} className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Hiring Authority</label>
            <select name="authority" defaultValue={editingHR.authority} className="w-full border border-gray-300 p-2 rounded-md text-gray-700">
              <option value="">Select authority level</option>
              <option>Full Authority</option>
              <option>Limited Authority</option>
              <option>Decision Influencer</option>
              <option>Screening Only</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select name="status" defaultValue={editingHR.status} className="w-full border border-gray-300 p-2 rounded-md text-gray-700">
              <option value="">Select status</option>
              <option>Active</option>
              <option>Responsive</option>
              <option>Contacted</option>
              <option>Not Responsive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Specializations</label>
            <input name="specializations" defaultValue={editingHR.specializations} className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Notes</label>
            <textarea name="notes" defaultValue={editingHR.notes} rows="3" className="w-full border border-gray-300 p-2 rounded-md text-gray-700" />
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
            <button type="button" onClick={() => setEditingHR(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}