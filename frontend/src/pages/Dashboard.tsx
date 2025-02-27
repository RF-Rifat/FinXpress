/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { adminApi } from "../services/api";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

interface AdminData {
  totalMoney: number;
  agentApprovalRequests: any[];
  allUsers: any[];
  allAgents: any[];
  allTransactions: any[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getAllAdminData();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBlockUser = async (userId: string) => {
    try {
      await adminApi.blockUser(userId);
      // Update the user's status in the local state
      setData((prevData) => ({
        ...prevData!,
        allUsers: prevData!.allUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: user.status === "active" ? "blocked" : "active",
              }
            : user
        ),
      }));
      toast.success("User blocked/unblocked successfully.");
    } catch (error) {
      console.error("Failed to block/unblock user:", error);
      toast.error("Failed to update user status.");
    }
  };

  const handleApproveAgent = async (
    agentId: string,
    status: "active" | "blocked"
  ) => {
    try {
      await adminApi.approveAgent({ agentId, status });
      // Update the agent's status in the local state
      setData((prevData) => ({
        ...prevData!,
        agentApprovalRequests: prevData!.agentApprovalRequests.filter(
          (agent) => agent._id !== agentId
        ),
        allAgents: prevData!.allAgents.map((agent) =>
          agent._id === agentId ? { ...agent, status } : agent
        ),
      }));
      toast.success(
        `Agent ${status === "active" ? "approved" : "rejected"} successfully.`
      );
    } catch (error) {
      console.error("Failed to approve/reject agent:", error);
      toast.error("Failed to update agent status.");
    }
  };

  const handleAddMoneyToAgent = async (agentId: string, amount: number) => {
    try {
      await adminApi.addMoneyToAgent({ agentId, amount });
      // Update the agent's balance in the local state
      setData((prevData) => ({
        ...prevData!,
        allAgents: prevData!.allAgents.map((agent) =>
          agent._id === agentId
            ? { ...agent, balance: agent.balance + amount }
            : agent
        ),
      }));
      toast.success("Money added to agent's account successfully.");
    } catch (error) {
      console.error("Failed to add money to agent:", error);
      toast.error("Failed to add money.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-red-500">No data available.</p>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h2>

      <div className="bg-white/50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Total Money in System
        </h3>
        <p className="text-2xl font-bold text-secondary">৳{data.totalMoney}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Agent Approval Requests
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.agentApprovalRequests.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">{agent.email}</td>
                  <td className="px-4 py-2">{agent.mobileNumber}</td>
                  <td className="px-4 py-2">{agent.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleApproveAgent(agent._id, "active")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveAgent(agent._id, "blocked")}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.allUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.mobileNumber}</td>
                  <td className="px-4 py-2">{user.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className={`${
                        user.status === "active"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } text-white px-3 py-1 rounded-md transition-colors`}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">All Agents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile Number</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.allAgents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">{agent.email}</td>
                  <td className="px-4 py-2">{agent.mobileNumber}</td>
                  <td className="px-4 py-2">৳{agent.balance}</td>
                  <td className="px-4 py-2">{agent.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleAddMoneyToAgent(agent._id, 1000)} // Example amount
                      className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition-colors"
                    >
                      Add Money
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">
          All Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Sender</th>
                <th className="px-4 py-2">Recipient</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Fee</th>
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.allTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{transaction.sender}</td>
                  <td className="px-4 py-2">{transaction.recipient}</td>
                  <td className="px-4 py-2">৳{transaction.amount}</td>
                  <td className="px-4 py-2">৳{transaction.fee}</td>
                  <td className="px-4 py-2">{transaction.transactionId}</td>
                  <td className="px-4 py-2">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
