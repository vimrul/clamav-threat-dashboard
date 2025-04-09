import { useState, useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import DarkModeToggle from "../components/DarkModeToggle";

const mockReports = [
  {
    id: 1,
    vm_name: "vm-001",
    timestamp: "2025-04-09T17:00:00Z",
    report:
      "Found 2 infected files: /home/test/eicar.com, /var/www/html/malware.js",
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
    report:
      "Found 3 infected files: /root/badfile, /home/mal.py, /opt/keylogger.sh",
  },
];

const ITEMS_PER_PAGE = 3;

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Replace with fetch later
    setReports(mockReports);
  }, []);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginated = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaShieldAlt className="text-2xl text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800 bg-blue-300 dark:bg-pink-300">
          ClamAV Scan Dashboard
        </h1>

        <DarkModeToggle />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">VM Name</th>
              <th className="px-6 py-3 text-left">Timestamp</th>
              <th className="px-6 py-3 text-left">Scan Report</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {paginated.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-6 py-4 font-medium">{r.vm_name}</td>
                <td className="px-6 py-4">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {r.report.includes("No threats") ? (
                    <span className="text-green-600 font-semibold">
                      ✅ {r.report}
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      ❌ {r.report}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <p className="text-gray-600">
          Showing {paginated.length} of {reports.length} reports
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
