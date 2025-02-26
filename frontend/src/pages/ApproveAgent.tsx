import React, { useState } from "react";
import { adminApi } from "../services/api";

const ApproveAgent: React.FC = () => {
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<"approve" | "reject">("approve");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await adminApi.approveAgent({ agentId, status });
      setSuccess(
        `Agent ${status === "approve" ? "approved" : "rejected"} successfully!`
      );
      console.log("Approve Agent Response:", response.data);
    } catch (err) {
      setError("Failed to update agent status. Please try again.");
      console.error("Approve Agent Error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Approve Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent ID
          </label>
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter Agent ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "approve" | "reject")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ApproveAgent;
