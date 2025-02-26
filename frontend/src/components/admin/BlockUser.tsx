import React, { useState } from "react";
import { adminApi } from "../../services/api";

const BlockUser: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.blockUser(userId);
      setMessage("User status updated successfully.");
    } catch (error) {
      setMessage("Failed to update user status.");
      console.error("Block User Error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Block/Unblock User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter User ID"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
        >
          Block/Unblock
        </button>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default BlockUser;
