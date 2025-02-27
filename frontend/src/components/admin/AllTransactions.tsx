import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";

interface Transaction {
  _id: string;
  sender: string;
  recipient: string;
  amount: number;
  fee: number;
  transactionId: string;
  createdAt: string;
}

const AllTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await adminApi.getAllTransactions();
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">All Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.sender}</td>
              <td>{transaction.recipient}</td>
              <td>৳{transaction.amount}</td>
              <td>৳{transaction.fee}</td>
              <td>{transaction.transactionId}</td>
              <td>{new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTransactions;
