import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";

const MonitorTotalMoney: React.FC = () => {
  const [totalMoney, setTotalMoney] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalMoney = async () => {
      try {
        const response = await adminApi.monitorTotalMoney();
        setTotalMoney(response.data.totalMoney);
      } catch (error) {
        console.error("Failed to fetch total money:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalMoney();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Monitor Total Money
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-lg font-semibold text-gray-700">
          Total Money in System:{" "}
          <span className="text-secondary">৳{totalMoney}</span>
        </p>
      )}
    </div>
  );
};

export default MonitorTotalMoney;
