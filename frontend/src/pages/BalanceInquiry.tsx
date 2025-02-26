import React, { useState } from "react";

const BalanceInquiry: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBalance = () => {
    setIsLoading(true);
    setTimeout(() => {
      setBalance(1000);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Balance Inquiry</h2>
      <div className="space-y-4">
        <button
          onClick={handleCheckBalance}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Check Balance"}
        </button>
        {balance !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-lg font-semibold text-gray-700">
              Your Balance: <span className="text-secondary">৳{balance}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceInquiry;
