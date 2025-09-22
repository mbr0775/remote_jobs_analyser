'use client';

export default function HRContacts({ filteredHrs, setEditingHR, deleteHR, setShowAddHR }) {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">HR Contacts</h1>
            <p className="text-gray-600">Manage HR contacts for job opportunities</p>
          </div>
          <button 
            onClick={() => setShowAddHR(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium w-full sm:w-auto"
          >
            <span className="text-lg">+</span>
            Add HR Contact
          </button>
        </div>

        <div className="space-y-4">
          {filteredHrs.map((hr) => (
            <div key={hr.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">👤</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900 break-words">{hr.name}</h2>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        hr.status === 'Active' ? 'bg-green-100 text-green-800' :
                        hr.status === 'Responsive' ? 'bg-blue-100 text-blue-800' :
                        hr.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        hr.status === 'Not Responsive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hr.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                      <span className="whitespace-nowrap">{hr.jobTitle}</span>
                      {hr.company && (
                        <>
                          <span>•</span>
                          <span className="whitespace-nowrap">{hr.company}</span>
                        </>
                      )}
                      {hr.department && (
                        <>
                          <span>•</span>
                          <span className="whitespace-nowrap">{hr.department}</span>
                        </>
                      )}
                    </div>
                    
                    {hr.authority && (
                      <p className="text-gray-700 mb-2 break-words">
                        <span className="font-medium">Hiring Authority:</span> {hr.authority}
                      </p>
                    )}
                    
                    {hr.specializations && (
                      <p className="text-gray-700 mb-2 break-words">
                        <span className="font-medium">Specializations:</span> {hr.specializations}
                      </p>
                    )}
                    
                    {hr.notes && (
                      <p className="text-gray-700 mb-4 leading-relaxed break-words">{hr.notes}</p>
                    )}
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 text-sm text-gray-600">
                        {hr.email && (
                          <div className="flex items-center gap-1 min-w-0">
                            <span>✉️</span>
                            <a href={`mailto:${hr.email}`} className="text-blue-600 hover:text-blue-800 break-all">
                              {hr.email}
                            </a>
                          </div>
                        )}
                        {hr.phone && (
                          <div className="flex items-center gap-1 min-w-0">
                            <span>📞</span>
                            <span className="break-all">{hr.phone}</span>
                          </div>
                        )}
                        {hr.linkedin && (
                          <div className="flex items-center gap-1 min-w-0">
                            <span>🔗</span>
                            <a href={hr.linkedin} className="text-blue-600 hover:text-blue-800 break-all" target="_blank" rel="noopener noreferrer">
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full mt-2">
                        {(hr.contacted === true || hr.contacted === 'true') ? (
                          <div className="flex justify-center">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Contacted
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleContacted(hr.id)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-1 sm:gap-2 flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => setEditingHR(hr)} 
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit HR contact"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteHR(hr.id)} 
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete HR contact"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredHrs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No HR contacts found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first HR contact</p>
              <button 
                onClick={() => setShowAddHR(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add HR Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}