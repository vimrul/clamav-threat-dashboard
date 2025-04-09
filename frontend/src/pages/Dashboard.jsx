import { useState, useEffect } from 'react';
import { FaShieldAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';


const ITEMS_PER_PAGE = 3;

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const mockReports = [
    {
      id: 1,
      vm_name: 'vm-001',
      timestamp: '2025-04-09T17:00:00Z',
      report: 'Found 2 infected files: /home/test/eicar.com, /var/www/html/malware.js',
    },
    {
      id: 2,
      vm_name: 'vm-002',
      timestamp: '2025-04-09T17:30:00Z',
      report: 'No threats found.',
    },
    {
      id: 3,
      vm_name: 'vm-003',
      timestamp: '2025-04-09T18:00:00Z',
      report: 'Found 1 infected file: /tmp/trojan.py',
    },
    {
      id: 4,
      vm_name: 'vm-004',
      timestamp: '2025-04-09T18:30:00Z',
      report: 'No threats found.',
    },
    {
      id: 5,
      vm_name: 'vm-005',
      timestamp: '2025-04-09T19:00:00Z',
      report: 'Found 3 infected files: /root/badfile, /home/mal.py, /opt/keylogger.sh',
    },
  ];

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredReports = reports
    .filter((r) => r.vm_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = sortField === 'timestamp' ? new Date(a[sortField]) : a[sortField];
      const bVal = sortField === 'timestamp' ? new Date(b[sortField]) : b[sortField];
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const total = filteredReports.length;
  const threats = filteredReports.filter((r) => !r.report.includes('No threats')).length;
  const clean = total - threats;

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginated = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortOrder === 'asc' ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">


      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaShieldAlt className="text-2xl text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold">ClamAV Scan Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Threats Found</p>
          <p className="text-2xl font-bold text-red-600">{threats}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Clean VMs</p>
          <p className="text-2xl font-bold text-green-600">{clean}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by VM name..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('vm_name')}>
                VM Name <SortIcon field="vm_name" />
              </th>
              <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('timestamp')}>
                Timestamp <SortIcon field="timestamp" />
              </th>
              <th className="px-6 py-3 text-left">Scan Report</th>
              <th className="px-6 py-3 text-left">Threat Level</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginated.map((r) => {
              const isClean = r.report.includes('No threats');
              return (
                <tr key={r.id} className={`border-t ${isClean ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                  <td className="px-6 py-4 font-medium">{r.vm_name}</td>
                  <td className="px-6 py-4">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {isClean ? (
                      <span className="text-green-600 font-semibold">✅ {r.report}</span>
                    ) : (
                      <span className="text-red-600 font-semibold">❌ {r.report}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isClean ? (
                      <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        Clean
                      </span>
                    ) : (
                      <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        High Risk
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {paginated.length} of {filteredReports.length} reports
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            Prev
          </button>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
