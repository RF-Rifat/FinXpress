import React, { useState } from "react";
import { adminApi } from "../../services/api";

const ApproveAgent: React.FC = () => {
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<"approve" | "reject">("approve");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.approveAgent({ agentId, status });
      setMessage(
        `Agent ${status === "approve" ? "approved" : "rejected"} successfully.`
      );
    } catch (error) {
      setMessage("Failed to update agent status.");
      console.error("Approve Agent Error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Approve/Reject Agent
      </h2>
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
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
        >
          Submit
        </button>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ApproveAgent;
