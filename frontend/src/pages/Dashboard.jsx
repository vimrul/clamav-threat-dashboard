import { useState, useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import DarkModeToggle from "../components/DarkModeToggle";

const mockReports = [
  {
    id: 1,
    vm_name: "vm-001",
    timestamp: "2025-04-09T17:00:00Z",
    report: "Found 2 infected files: /home/test/eicar.com, /var/www/html/malware.js",
  },
  {
    id: 2,
    vm_name: "vm-002",
    timestamp: "2025-04-09T17:30:00Z",
    report: "No threats found.",
  },
  {
    id: 3,
    vm_name: "vm-003",
    timestamp: "2025-04-09T18:00:00Z",
    report: "Found 1 infected file: /tmp/trojan.py",
  },
  {
    id: 4,
    vm_name: "vm-004",
    timestamp: "2025-04-09T18:30:00Z",
    report: "No threats found.",
  },
  {
    id: 5,
    vm_name: "vm-005",
    timestamp: "2025-04-09T19:00:00Z",
    report: "Found 3 infected files: /root/badfile, /home/mal.py, /opt/keylogger.sh",
  },
];

const ITEMS_PER_PAGE = 3;

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter((r) =>
    r.vm_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginated = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["VM Name,Timestamp,Report"]
        .concat(
          filteredReports.map(
            (r) =>
              `"${r.vm_name}","${new Date(r.timestamp).toLocaleString()}","${r.report}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clamav_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-2xl text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">ClamAV Scan Dashboard</h1>
        </div>
        <DarkModeToggle />
      </div>

      {/* 🔍 Search + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by VM name..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📥 Export CSV
        </button>
      </div>

      {/* 📋 Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">VM Name</th>
              <th className="px-6 py-3 text-left">Timestamp</th>
              <th className="px-6 py-3 text-left">Scan Report</th>
              <th className="px-6 py-3 text-left">Threat Level</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {paginated.map((r) => {
              const isClean = r.report.includes("No threats");
              return (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{highlightText(r.vm_name)}</td>
                  <td className="px-6 py-4">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {isClean ? (
                      <span className="text-green-600 font-semibold" title="No infected files found">
                        ✅ {r.report}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold" title="Infected files detected">
                        ❌ {r.report}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isClean ? (
                      <span
                        className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded"
                        title="Safe"
                      >
                        Clean
                      </span>
                    ) : (
                      <span
                        className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded"
                        title="Risk Detected"
                      >
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

      {/* 🔁 Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <p className="text-gray-600">
          Showing {paginated.length} of {filteredReports.length} reports
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1 bg-gray-100 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
