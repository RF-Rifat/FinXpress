import CashOut from "./CashOut";
import CashIn from "./CashIn";
import ApproveAgent from "./ApproveAgent";
import BalanceInquiry from "./BalanceInquiry";
const SendMoney = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="space-y-8">
        <CashOut />
        <CashIn />
        <ApproveAgent />
        <BalanceInquiry />
      </div>
    </div>
  );
};

export default SendMoney;
