// ADD these imports at the top:
import { useState, useEffect } from "react";
import axios from "axios";
import { FaShieldAlt } from "react-icons/fa";
import DarkModeToggle from "../components/DarkModeToggle";

const ITEMS_PER_PAGE = 20;

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  // 🆕 States for new report
  const [vmName, setVmName] = useState("");
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://clamav-backend:8000";
  
    axios
      .get(`${API_URL}/reports`)
      .then((res) => setReports(res.data))
      .catch((err) => console.error("❌ Failed to fetch reports:", err));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      vm_name: vmName,
      report: reportText,
      timestamp: new Date().toISOString(),
    };

    axios
      .post("http://localhost:8000/report", newReport)
      .then(() => {
        fetchReports();
        setVmName("");
        setReportText("");
      })
      .catch((err) => console.error("Failed to submit report", err));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredReports = reports
    .filter((r) => r.vm_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = sortField === "timestamp" ? new Date(a[sortField]) : a[sortField].toLowerCase();
      const bVal = sortField === "timestamp" ? new Date(b[sortField]) : b[sortField].toLowerCase();
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const paginated = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="ml-1">⇅</span>;
    return sortOrder === "asc" ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-md shadow" />
        {/* <FaShieldAlt className="text-3xl font-bold text-gray-800 dark:text-white" /> */}
        <h1 className="text-3xl font-bold">ClamAV Scan Dashboard</h1>
        <DarkModeToggle />
      </div>

      {/* 🔧 Add New Report Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📝 Submit New Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">VM Name</label>
            <input
              type="text"
              value={vmName}
              onChange={(e) => setVmName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Scan Report</label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Report
          </button>
        </form>
      </div>

      {/* ✅ Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by VM name..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort("vm_name")}>
                VM Name <SortIcon field="vm_name" />
              </th>
              <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort("timestamp")}>
                Timestamp <SortIcon field="timestamp" />
              </th>
              <th className="px-6 py-3 text-left">Scan Report</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginated.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-6 py-4 font-medium">{r.vm_name}</td>
                <td className="px-6 py-4">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {r.report.includes("No threats") ? (
                    <span className="text-green-600 font-semibold">✅ {r.report}</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ {r.report}</span>
                  )}
                </td>
              </tr>
            ))}
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
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Prev
          </button>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
