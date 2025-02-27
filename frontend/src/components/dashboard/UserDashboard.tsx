/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { userApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  status: string;
  balance: number;
  transactions: any[];
}

const UserDetails: React.FC = () => {
   const { user } = useAuth();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getUserById(user?.userId!);
        setData(response.data.user);
        toast.success("User data loaded successfully!");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">User not found.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8">User Details</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Mobile Number:</strong> {user.mobileNumber}
            </p>
            <p>
              <strong>Balance:</strong> ৳{data?.balance}
            </p>
            <p>
              <strong>Status:</strong> {data?.status}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
            Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">৳{transaction.amount}</td>
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
    </div>
  );
};

export default UserDetails;
