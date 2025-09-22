// components/Overview.js
'use client';

export default function Overview({ totalCompanies, companiesContacted, hrContacts, recentActivity, setShowAddCompany, setShowAddHR }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">Total Companies</h2>
          <p className="text-2xl">{totalCompanies}</p>
          <p className="text-green-500">+15% from last month</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">Companies Contacted</h2>
          <p className="text-2xl">{companiesContacted}</p>
          <p className="text-green-500">{((companiesContacted / totalCompanies) * 100 || 0).toFixed(0)}% of total companies</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">HR Contacts</h2>
          <p className="text-2xl">{hrContacts}</p>
          <p className="text-green-500">+15% from last month</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">Recent Activity</h2>
          <p className="text-2xl">{recentActivity}</p>
          <p className="text-green-500">New entries today</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Quick Actions</h2>
        <div className="flex space-x-4">
          <button onClick={() => setShowAddCompany(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add New Company
          </button>
          <button onClick={() => setShowAddHR(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add HR Contact
          </button>
        </div>
      </div>
    </div>
  );
}