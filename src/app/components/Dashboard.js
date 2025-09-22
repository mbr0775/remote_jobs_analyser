'use client';

import Overview from './Overview';
import Companies from './Companies';
import HRContacts from './HRContacts';
import AddCompanyModal from './AddCompanyModal';
import EditCompanyModal from './EditCompanyModal';
import AddHRModal from './AddHRModal';
import EditHRModal from './EditHRModal';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orxbfzrudpsdqoiolmri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeGJmenJ1ZHBzZHFvaW9sbXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkwNzEsImV4cCI6MjA3NDA1NTA3MX0.OZVNJgfdEazDB9H7XRgN4ESUs3XdX0k2uLKK-HOK1jc';

export default function Dashboard() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [tab, setTab] = useState('overview');
  const [companies, setCompanies] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddHR, setShowAddHR] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingHR, setEditingHR] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAppliedModal, setShowAppliedModal] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    status: '',
    contacted: '',
    applied: '',
    location: '',
    size: ''
  });

  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      const { data: companiesData, error: cError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (cError) {
        console.error('Error fetching companies:', cError);
      } else {
        setCompanies(companiesData || []);
      }

      const { data: hrsData, error: hError } = await supabase
        .from('hrs')
        .select('*')
        .order('created_at', { ascending: false });

      if (hError) {
        console.error('Error fetching HR contacts:', hError);
      } else {
        setHrs(hrsData || []);
      }
    }

    loadData();
  }, []);

  // CRUD for companies
  const addCompany = (newCompany) => {
    setCompanies([newCompany, ...companies]);
  };

  const editCompany = async (updatedCompany) => {
    const { error } = await supabase
      .from('companies')
      .update(updatedCompany)
      .eq('id', updatedCompany.id);

    if (error) {
      console.error('Error updating company:', error);
    } else {
      setCompanies(companies.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)));
    }
  };

  const deleteCompany = async (id) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
    } else {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  // CRUD for HR
  const addHR = (newHR) => {
    setHrs([newHR, ...hrs]);
  };

  const editHR = async (updatedHR) => {
    const { error } = await supabase
      .from('hrs')
      .update(updatedHR)
      .eq('id', updatedHR.id);

    if (error) {
      console.error('Error updating HR:', error);
    } else {
      setHrs(hrs.map((h) => (h.id === updatedHR.id ? updatedHR : h)));
    }
  };

  const deleteHR = async (id) => {
    const { error } = await supabase
      .from('hrs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting HR:', error);
    } else {
      setHrs(hrs.filter((h) => h.id !== id));
    }
  };

  // Mark contacted/applied
  const toggleContacted = async (id) => {
    const company = companies.find((c) => c.id === id);
    if (!company) return;
    const newValue = !company.contacted;

    const { error } = await supabase
      .from('companies')
      .update({ contacted: newValue })
      .eq('id', id);

    if (error) {
      console.error('Error toggling contacted:', error);
    } else {
      setCompanies(companies.map((c) => (c.id === id ? { ...c, contacted: newValue } : c)));
      setFilters(prev => ({ ...prev, contacted: '' }));
    }
  };

  const toggleApplied = async (id) => {
    const company = companies.find((c) => c.id === id);
    if (!company) return;
    const newValue = !company.applied;

    const { error } = await supabase
      .from('companies')
      .update({ applied: newValue })
      .eq('id', id);

    if (error) {
      console.error('Error toggling applied:', error);
    } else {
      setCompanies(companies.map((c) => (c.id === id ? { ...c, applied: newValue } : c)));
      setFilters(prev => ({ ...prev, applied: '' }));
    }
  };

  // Enhanced filtered lists with comprehensive search and filters
  const filteredCompanies = companies.filter((c) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = !search || (
      c.name?.toLowerCase().includes(searchTerm) ||
      c.job_title?.toLowerCase().includes(searchTerm) ||
      c.industry?.toLowerCase().includes(searchTerm) ||
      c.job_description?.toLowerCase().includes(searchTerm) ||
      c.location?.toLowerCase().includes(searchTerm) ||
      c.size?.toLowerCase().includes(searchTerm) ||
      c.status?.toLowerCase().includes(searchTerm) ||
      c.website?.toLowerCase().includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm) ||
      c.phone?.toLowerCase().includes(searchTerm) ||
      c.founded?.toString().includes(searchTerm)
    );

    const matchesFilters = (
      (!filters.industry || c.industry?.toLowerCase().includes(filters.industry.toLowerCase())) &&
      (!filters.status || c.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
      (!filters.location || c.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.size || c.size?.toLowerCase().includes(filters.size.toLowerCase())) &&
      (filters.contacted === '' || 
        (filters.contacted === 'yes' && c.contacted) ||
        (filters.contacted === 'no' && !c.contacted)
      ) &&
      (filters.applied === '' || 
        (filters.applied === 'yes' && c.applied) ||
        (filters.applied === 'no' && !c.applied)
      )
    );

    return matchesSearch && matchesFilters;
  });

  const filteredHrs = hrs.filter((h) => {
    const searchTerm = search.toLowerCase();
    return !search || (
      h.name?.toLowerCase().includes(searchTerm) ||
      h.company?.toLowerCase().includes(searchTerm) ||
      h.job_title?.toLowerCase().includes(searchTerm) ||
      h.department?.toLowerCase().includes(searchTerm) ||
      h.email?.toLowerCase().includes(searchTerm) ||
      h.phone?.toLowerCase().includes(searchTerm) ||
      h.linkedin?.toLowerCase().includes(searchTerm) ||
      h.authority?.toLowerCase().includes(searchTerm) ||
      h.specializations?.toLowerCase().includes(searchTerm) ||
      h.notes?.toLowerCase().includes(searchTerm)
    );
  });

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    const values = companies.map(c => c[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      status: '',
      contacted: '',
      applied: '',
      location: '',
      size: ''
    });
    setSearch('');
  };

  // Overview stats - Using actual data instead of hardcoded values
  const totalCompanies = companies.length;
  const companiesContacted = companies.filter((c) => c.contacted || c.applied).length;
  const hrContacts = hrs.length;
  const recentActivity = companies.filter((c) => 
    new Date(c.created_at).toDateString() === new Date().toDateString()
  ).length;

  // Export to CSV (companies)
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Job Title', 'Industry', 'Size', 'Founded', 'Location', 'Website', 'Phone', 'Email', 'Status', 'Job Description', 'Resume Deadline Date', 'Contacted', 'Applied'],
      ...companies.map((c) => [
        c.name || '',
        c.job_title || '',
        c.industry || '',
        c.size || '',
        c.founded || '',
        c.location || '',
        c.website || '',
        c.phone || '',
        c.email || '',
        c.status || '',
        c.job_description || '',
        c.resume_deadline_date || '',
        c.contacted || false,
        c.applied || false,
      ]),
    ]
      .map((row) => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'companies.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Export to Excel (companies)
  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // Prepare companies data
      const companiesData = companies.map(c => ({
        'Company Name': c.name || '',
        'Job Title': c.job_title || '',
        'Industry': c.industry || '',
        'Size': c.size || '',
        'Founded': c.founded || '',
        'Location': c.location || '',
        'Website': c.website || '',
        'Phone': c.phone || '',
        'Email': c.email || '',
        'Status': c.status || '',
        'Job Description': c.job_description || '',
        'Resume Deadline Date': c.resume_deadline_date || '',
        'Contacted': c.contacted || false,
        'Applied': c.applied || false,
        'Created At': c.created_at || ''
      }));

      // Prepare HR data
      const hrsData = hrs.map(h => ({
        'HR Name': h.name || '',
        'Job Title': h.job_title || '',
        'Company': h.company || '',
        'Department': h.department || '',
        'Email': h.email || '',
        'Phone': h.phone || '',
        'LinkedIn': h.linkedin || '',
        'Authority': h.authority || '',
        'Status': h.status || '',
        'Specializations': h.specializations || '',
        'Notes': h.notes || '',
        'Created At': h.created_at || ''
      }));

      const wb = XLSX.utils.book_new();
      
      // Add companies sheet
      const wsCompanies = XLSX.utils.json_to_sheet(companiesData);
      XLSX.utils.book_append_sheet(wb, wsCompanies, 'Companies');
      
      // Add HR contacts sheet
      const wsHR = XLSX.utils.json_to_sheet(hrsData);
      XLSX.utils.book_append_sheet(wb, wsHR, 'HR Contacts');
      
      XLSX.writeFile(wb, 'job_database.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Excel export failed. Please install xlsx package: npm install xlsx');
    }
    setShowExportMenu(false);
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job Database Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .section { margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <h1>Job Database Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="section">
            <h2>Companies (${companies.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Contacted</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                ${companies.map(c => `
                  <tr>
                    <td>${c.name || ''}</td>
                    <td>${c.job_title || ''}</td>
                    <td>${c.industry || ''}</td>
                    <td>${c.location || ''}</td>
                    <td>${c.status || ''}</td>
                    <td>${c.contacted ? 'Yes' : 'No'}</td>
                    <td>${c.applied ? 'Yes' : 'No'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>HR Contacts (${hrs.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                ${hrs.map(h => `
                  <tr>
                    <td>${h.name || ''}</td>
                    <td>${h.job_title || ''}</td>
                    <td>${h.company || ''}</td>
                    <td>${h.department || ''}</td>
                    <td>${h.email || ''}</td>
                    <td>${h.phone || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
        </html>
      `;

      // Create a new window and print to PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDF export failed.');
    }
    setShowExportMenu(false);
  };

  // Export to Word DOC
  const exportToDoc = () => {
    try {
      const docContent = `
        Job Database Report
        Generated on: ${new Date().toLocaleDateString()}

        COMPANIES (${companies.length})
        ================
        ${companies.map(c => `
        Company: ${c.name || 'N/A'}
        Job Title: ${c.job_title || 'N/A'}
        Industry: ${c.industry || 'N/A'}
        Location: ${c.location || 'N/A'}
        Status: ${c.status || 'N/A'}
        Contacted: ${c.contacted ? 'Yes' : 'No'}
        Applied: ${c.applied ? 'Yes' : 'No'}
        Job Description: ${c.job_description || 'N/A'}
        ---
        `).join('')}

        HR CONTACTS (${hrs.length})
        ================
        ${hrs.map(h => `
        Name: ${h.name || 'N/A'}
        Job Title: ${h.job_title || 'N/A'}
        Company: ${h.company || 'N/A'}
        Department: ${h.department || 'N/A'}
        Email: ${h.email || 'N/A'}
        Phone: ${h.phone || 'N/A'}
        ---
        `).join('')}
      `;

      const blob = new Blob([docContent], { type: 'application/msword' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'job_database.doc');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to DOC:', error);
      alert('DOC export failed.');
    }
    setShowExportMenu(false);
  };

  // Export to JSON
  const exportToJSON = () => {
    try {
      const jsonData = {
        exportDate: new Date().toISOString(),
        companies: companies,
        hrContacts: hrs,
        statistics: {
          totalCompanies,
          companiesContacted,
          hrContacts: hrContacts,
          recentActivity
        }
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'job_database.json');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      alert('JSON export failed.');
    }
    setShowExportMenu(false);
  };

  // Import file (CSV or Excel)
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.name.endsWith('.csv')) {
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').slice(1); // Skip header
          const newCompanies = lines
            .filter((line) => line.trim())
            .map((line) => {
              // Simple CSV parsing (handles quoted fields)
              const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
              const cleanFields = fields.map(field => field.replace(/^"|"$/g, ''));
              
              return {
                name: cleanFields[0] || '',
                job_title: cleanFields[1] || '',
                industry: cleanFields[2] || '',
                size: cleanFields[3] || '',
                founded: cleanFields[4] || '',
                location: cleanFields[5] || '',
                website: cleanFields[6] || '',
                phone: cleanFields[7] || '',
                email: cleanFields[8] || '',
                status: cleanFields[9] || '',
                job_description: cleanFields[10] || '',
                resume_deadline_date: cleanFields[11] || '',
                contacted: cleanFields[12] === 'true',
                applied: cleanFields[13] === 'true',
                created_at: new Date().toISOString(),
              };
            });

          const { data: inserted, error } = await supabase
            .from('companies')
            .insert(newCompanies)
            .select();

          if (error) throw error;

          setCompanies([...companies, ...inserted]);
        } catch (error) {
          console.error('Error importing CSV:', error);
          alert('Error importing CSV file');
        } finally {
          setShowMenu(false);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx')) {
      reader.onload = async (event) => {
        try {
          const XLSX = await import('xlsx');
          const data = event.target.result;
          const wb = XLSX.read(data, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const importedData = XLSX.utils.sheet_to_json(ws);
          const newCompanies = importedData.map((c) => {
            delete c.id;
            return {
              ...c,
              job_title: c['Job Title'] || c.job_title,
              job_description: c['Job Description'] || c.job_description,
              resume_deadline_date: c['Resume Deadline Date'] || c.resume_deadline_date,
              created_at: new Date().toISOString(),
            };
          });

          const { data: inserted, error } = await supabase
            .from('companies')
            .insert(newCompanies)
            .select();

          if (error) throw error;

          setCompanies([...companies, ...inserted]);
        } catch (error) {
          console.error('Error importing Excel:', error);
          alert('Excel import failed. Please install xlsx package: npm install xlsx');
        } finally {
          setShowMenu(false);
        }
      };
      reader.readAsBinaryString(file);
    }
    
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">IT Job Management Platform</h1>
              <p className="text-sm text-gray-500">Comprehensive database for IT companies and opportunities</p>
            </div>
          </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto relative">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search companies, jobs, contacts, locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  showFilters || Object.values(filters).some(f => f !== '')
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {Object.values(filters).some(f => f !== '') && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {Object.values(filters).filter(f => f !== '').length}
                  </span>
                )}
              </button>
            
            {/* Buttons on larger screens */}
            <div className="hidden md:flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import
                <input type="file" hidden onChange={handleImport} accept=".csv,.xlsx" />
              </label>

              {/* Export Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Export
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-20 w-48">
                    <div className="p-2">
                      <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export as CSV
                      </button>
                      
                      <button 
                        onClick={exportToExcel}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Export as XLSX
                      </button>
                      
                      <button 
                        onClick={exportToDoc}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export as DOC
                      </button>
                      
                      <button 
                        onClick={exportToPDF}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export as PDF
                      </button>
                      
                      <button 
                        onClick={exportToJSON}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Export as JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

              {/* Hamburger on small screens */}
              <div className="md:hidden relative">
                <button 
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-10 w-48">
                    {/* Mobile Filters */}
                    <button 
                      onClick={() => { setShowFilters(!showFilters); setShowMenu(false); }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors w-full ${
                        showFilters || Object.values(filters).some(f => f !== '')
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                      {Object.values(filters).some(f => f !== '') && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                          {Object.values(filters).filter(f => f !== '').length}
                        </span>
                      )}
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Import
                      <input type="file" hidden onChange={handleImport} accept=".csv,.xlsx" />
                    </label>

                  {/* Mobile Export Options */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <p className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Export Options</p>
                    
                    <button 
                      onClick={() => { exportToCSV(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      CSV
                    </button>
                    
                    <button 
                      onClick={() => { exportToExcel(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      XLSX
                    </button>
                    
                    <button 
                      onClick={() => { exportToDoc(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      DOC
                    </button>
                    
                    <button 
                      onClick={() => { exportToPDF(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </button>
                    
                    <button 
                      onClick={() => { exportToJSON(); setShowMenu(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({...filters, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Industries</option>
                {getUniqueValues('industry').map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {getUniqueValues('status').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {getUniqueValues('location').map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Company Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sizes</option>
                {getUniqueValues('size').map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Contacted Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacted</label>
              <select
                value={filters.contacted}
                onChange={(e) => setFilters({...filters, contacted: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="yes">Contacted</option>
                <option value="no">Not Contacted</option>
              </select>
            </div>

            {/* Applied Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applied</label>
              <select
                value={filters.applied}
                onChange={(e) => setFilters({...filters, applied: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="yes">Applied</option>
                <option value="no">Not Applied</option>
              </select>
            </div>
          </div>

          {/* Filter Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing <span className="font-semibold text-gray-900">{filteredCompanies.length}</span> of <span className="font-semibold text-gray-900">{companies.length}</span> companies
                {search && <span> matching "<span className="font-semibold text-blue-600">{search}</span>"</span>}
              </div>
              {(search || Object.values(filters).some(f => f !== '')) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex">
          <button
            onClick={() => setTab('overview')}
            className={`flex-1 px-6 py-4 text-sm font-medium rounded-l-lg transition-colors ${
              tab === 'overview' 
                ? 'bg-white text-gray-900 border-b-2 border-blue-600' 
                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('companies')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              tab === 'companies' 
                ? 'bg-white text-gray-900 border-b-2 border-blue-600' 
                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Companies
          </button>
          <button
            onClick={() => setTab('hr')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              tab === 'hr' 
                ? 'bg-white text-gray-900 border-b-2 border-blue-600' 
                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            HR Contacts
          </button>
          <button
            onClick={() => setTab('applied')}
            className={`flex-1 px-6 py-4 text-sm font-medium rounded-r-lg transition-colors ${
              tab === 'applied' 
                ? 'bg-white text-gray-900 border-b-2 border-blue-600' 
                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Applied Jobs
          </button>
        </div>
      </div>

      <main>
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards - Now using actual data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Companies */}
              <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer" onClick={() => setTab('companies')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Companies</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{totalCompanies}</div>
                <p className="text-xs text-gray-500">{totalCompanies === 0 ? 'Start by adding companies' : 'Total companies in database'}</p>
              </div>

              {/* Companies Contacted/Applied */}
              <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer" onClick={() => setShowAppliedModal(true)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Applied/Contacted</h3>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{companiesContacted}</div>
                <p className="text-xs text-gray-500">{totalCompanies > 0 ? `${Math.round((companiesContacted/totalCompanies)*100)}% of total companies` : 'No activity yet'}</p>
              </div>

              {/* HR Contacts */}
              <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer" onClick={() => setTab('hr')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">HR Contacts</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{hrContacts}</div>
                <p className="text-xs text-gray-500">{hrContacts === 0 ? 'Start by adding HR contacts' : 'Total HR contacts in database'}</p>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Today's Activity</h3>
                  <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{recentActivity}</div>
                <p className="text-xs text-gray-500">{recentActivity === 0 ? 'No new entries today' : 'New entries today'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-sm text-gray-500">Manage your IT job database efficiently</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAddCompany(true)}
                  className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Add New Company</span>
                </button>

                <button
                  onClick={() => setTab('companies')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <span className="font-medium">Browse Companies</span>
                </button>

                <button
                  onClick={() => setShowAddHR(true)}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className="font-medium">Add HR Contact</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'companies' && (
          <Companies
            filteredCompanies={filteredCompanies}
            toggleApplied={toggleApplied}
            toggleContacted={toggleContacted}
            setEditingCompany={setEditingCompany}
            deleteCompany={deleteCompany}
            setShowAddCompany={setShowAddCompany}
          />
        )}

        {tab === 'hr' && (
          <HRContacts
            filteredHrs={filteredHrs}
            setEditingHR={setEditingHR}
            deleteHR={deleteHR}
            setShowAddHR={setShowAddHR}
          />
        )}

        {tab === 'applied' && (
          <Companies
            filteredCompanies={filteredCompanies.filter(c => c.applied)}
            toggleApplied={toggleApplied}
            toggleContacted={toggleContacted}
            setEditingCompany={setEditingCompany}
            deleteCompany={deleteCompany}
            setShowAddCompany={setShowAddCompany}
            title="Applied Jobs"
            description="View and manage your applied job opportunities"
            emptyTitle="No applied jobs found"
            emptyDescription="You haven't applied to any jobs yet. Browse companies to find opportunities."
            showAdd={false}
          />
        )}
      </main>

      {/* Applied/Contacted Modal */}
      {showAppliedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowAppliedModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Companies
              filteredCompanies={companies.filter(c => c.applied || c.contacted)}
              toggleApplied={toggleApplied}
              toggleContacted={toggleContacted}
              setEditingCompany={setEditingCompany}
              deleteCompany={deleteCompany}
              setShowAddCompany={() => {}}
              title="Applied and Contacted Companies"
              description="Companies you have applied to or contacted"
              emptyTitle="No applied or contacted companies"
              emptyDescription="You haven't applied to or contacted any companies yet."
              showAdd={false}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddCompany && (
        <AddCompanyModal 
          addCompany={addCompany} 
          setShowAddCompany={setShowAddCompany} 
        />
      )}

      {editingCompany && (
        <EditCompanyModal 
          editCompany={editCompany} 
          editingCompany={editingCompany} 
          setEditingCompany={setEditingCompany} 
        />
      )}

      {showAddHR && (
        <AddHRModal 
          addHR={addHR} 
          setShowAddHR={setShowAddHR} 
          companies={companies} 
        />
      )}

      {editingHR && (
        <EditHRModal 
          editHR={editHR} 
          editingHR={editingHR} 
          setEditingHR={setEditingHR} 
          companies={companies} 
        />
      )}

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}