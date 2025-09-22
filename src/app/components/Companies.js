'use client';

import { useState } from 'react';

export default function Companies({ filteredCompanies, toggleApplied, toggleContacted, setEditingCompany, deleteCompany, setShowAddCompany }) {
  
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to check if deadline is approaching or passed
  const getDeadlineStatus = (dateString) => {
    if (!dateString) return null;
    
    const deadlineDate = new Date(dateString);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'passed';
    if (diffDays <= 3) return 'urgent';
    if (diffDays <= 7) return 'soon';
    return 'normal';
  };

  // Helper to get status badge classes
  const getStatusClasses = (status) => {
    return `px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
      status === 'Active' ? 'bg-blue-100 text-blue-800' :
      status === 'Partnered' ? 'bg-green-100 text-green-800' :
      status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
      status === 'Interviewed' ? 'bg-purple-100 text-purple-800' :
      status === 'Not Interested' ? 'bg-red-100 text-red-800' :
      'bg-gray-100 text-gray-800'
    }`;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Companies</h1>
            <p className="text-gray-600">Manage IT companies offering job opportunities</p>
          </div>
          <button 
            onClick={() => setShowAddCompany(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium w-full sm:w-auto"
          >
            <span className="text-lg">+</span>
            Add Company
          </button>
        </div>

        <div className="space-y-4">
          {filteredCompanies && filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div 
                    className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-bold">🏢</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900 break-words">{company.name}</h2>
                        <span className={getStatusClasses(company.status)}>
                          {company.status}
                        </span>
                      </div>

                      {/* Job Title Section */}
                      {company.job_title && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                            💼 {company.job_title}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        {company.industry && <span className="whitespace-nowrap">{company.industry}</span>}
                        {company.industry && company.size && <span>•</span>}
                        {company.size && <span className="whitespace-nowrap">{company.size} employees</span>}
                        {(company.industry || company.size) && company.founded && <span>•</span>}
                        {company.founded && <span className="whitespace-nowrap">Founded {company.founded}</span>}
                      </div>
                      
                      {company.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed break-words">{company.description}</p>
                      )}
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 text-sm text-gray-600">
                          {company.location && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span>📍</span>
                              <span className="break-all">{company.location}</span>
                            </div>
                          )}
                          {company.website && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span>🌐</span>
                              <a href={company.website} className="text-blue-600 hover:text-blue-800 break-all" target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span>📞</span>
                              <span className="break-all">{company.phone}</span>
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span>✉️</span>
                              <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800 break-all">
                                {company.email}
                              </a>
                            </div>
                          )}
                          {company.resume_deadline_date && (
                            <div className="flex items-center gap-1 min-w-0">
                              <span>📅</span>
                              <span className={`break-all ${
                                getDeadlineStatus(company.resume_deadline_date) === 'passed' ? 'text-red-600 font-medium' :
                                getDeadlineStatus(company.resume_deadline_date) === 'urgent' ? 'text-orange-600 font-medium' :
                                getDeadlineStatus(company.resume_deadline_date) === 'soon' ? 'text-yellow-600 font-medium' :
                                'text-gray-600'
                              }`}>
                                Deadline: {formatDate(company.resume_deadline_date)}
                                {getDeadlineStatus(company.resume_deadline_date) === 'passed' && ' (Passed)'}
                                {getDeadlineStatus(company.resume_deadline_date) === 'urgent' && ' (Urgent)'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full mt-2">
                          {(company.applied === true || company.applied === 'true') ? (
                            <div className="flex justify-center">
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Applied
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleApplied(company.id);
                              }}
                              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1 sm:gap-2 flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setEditingCompany(company)} 
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit company"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteCompany(company.id)} 
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete company"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first company</p>
              <button 
                onClick={() => setShowAddCompany(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Company
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setSelectedCompany(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🏢</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedCompany.name}</h2>
                  <span className={`mt-2 inline-block ${getStatusClasses(selectedCompany.status)}`}>
                    {selectedCompany.status}
                  </span>
                </div>
              </div>

              {selectedCompany.job_title && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 text-base font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    💼 {selectedCompany.job_title}
                  </span>
                </div>
              )}

              {selectedCompany.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCompany.description}</p>
                </div>
              )}

              {selectedCompany.job_description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedCompany.job_description}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  {selectedCompany.industry && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Industry:</span>
                      <span>{selectedCompany.industry}</span>
                    </div>
                  )}
                  {selectedCompany.size && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Size:</span>
                      <span>{selectedCompany.size} employees</span>
                    </div>
                  )}
                  {selectedCompany.founded && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Founded:</span>
                      <span>{selectedCompany.founded}</span>
                    </div>
                  )}
                  {selectedCompany.location && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📍 Location:</span>
                      <span>{selectedCompany.location}</span>
                    </div>
                  )}
                  {selectedCompany.website && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">🌐 Website:</span>
                      <a href={selectedCompany.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {selectedCompany.website}
                      </a>
                    </div>
                  )}
                  {selectedCompany.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📞 Phone:</span>
                      <span>{selectedCompany.phone}</span>
                    </div>
                  )}
                  {selectedCompany.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">✉️ Email:</span>
                      <a href={`mailto:${selectedCompany.email}`} className="text-blue-600 hover:underline">
                        {selectedCompany.email}
                      </a>
                    </div>
                  )}
                  {selectedCompany.resume_deadline_date && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📅 Deadline:</span>
                      <span className={`${
                        getDeadlineStatus(selectedCompany.resume_deadline_date) === 'passed' ? 'text-red-600' :
                        getDeadlineStatus(selectedCompany.resume_deadline_date) === 'urgent' ? 'text-orange-600' :
                        getDeadlineStatus(selectedCompany.resume_deadline_date) === 'soon' ? 'text-yellow-600' :
                        'text-gray-700'
                      }`}>
                        {formatDate(selectedCompany.resume_deadline_date)}
                        {getDeadlineStatus(selectedCompany.resume_deadline_date) === 'passed' && ' (Passed)'}
                        {getDeadlineStatus(selectedCompany.resume_deadline_date) === 'urgent' && ' (Urgent)'}
                        {getDeadlineStatus(selectedCompany.resume_deadline_date) === 'soon' && ' (Soon)'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Applied:</span>
                    <span className={selectedCompany.applied ? 'text-green-600' : 'text-red-600'}>
                      {selectedCompany.applied ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Contacted:</span>
                    <span className={selectedCompany.contacted ? 'text-green-600' : 'text-red-600'}>
                      {selectedCompany.contacted ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {!selectedCompany.applied && (
                  <button
                    onClick={() => {
                      toggleApplied(selectedCompany.id);
                      setSelectedCompany(null);
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                )}
                {!selectedCompany.contacted && (
                  <button
                    onClick={() => {
                      toggleContacted(selectedCompany.id);
                      setSelectedCompany(null);
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Mark as Contacted
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingCompany(selectedCompany);
                    setSelectedCompany(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Edit Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}