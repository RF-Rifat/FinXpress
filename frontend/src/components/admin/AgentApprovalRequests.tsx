import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  status: string;
}

const AgentApprovalRequests: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await adminApi.getAgentApprovalRequests();
        setAgents(response.data.agents);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleApproveReject = async (
    agentId: string,
    status: "approve" | "reject"
  ) => {
    try {
      await adminApi.approveAgent({ agentId, status });
      setAgents((prev) =>
        prev.map((agent) =>
          agent._id === agentId ? { ...agent, status } : agent
        )
      );
    } catch (error) {
      console.error("Failed to update agent status:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Agent Approval Requests
      </h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.mobileNumber}</td>
              <td>{agent.status}</td>
              <td>
                <button
                  onClick={() => handleApproveReject(agent._id, "approve")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(agent._id, "reject")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentApprovalRequests;
