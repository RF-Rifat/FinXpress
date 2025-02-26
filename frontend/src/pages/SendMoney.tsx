// src/components/SendMoney.tsx
import React, { useState } from "react";
import { transactionApi } from "../services/api";

const SendMoney = () => {
  const [recipientMobileNumber, setRecipientMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await transactionApi.sendMoney({
        recipientMobileNumber,
        amount: parseFloat(amount),
        pin,
      });

      setMessage(response.data.message);
      setRecipientMobileNumber("");
      setAmount("");
      setPin("");
    } catch (error) {
      setMessage("Failed to send money. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary">Send Money</h2>
        <form onSubmit={handleSendMoney}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Recipient's Mobile Number
            </label>
            <input
              type="text"
              value={recipientMobileNumber}
              onChange={(e) => setRecipientMobileNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount (Taka)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              min="50"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              maxLength={5}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isLoading ? "Sending..." : "Send Money"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMoney;
