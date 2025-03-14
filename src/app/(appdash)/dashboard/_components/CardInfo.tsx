import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";

import React, { useEffect } from "react";

function CardInfo() {
  useEffect(() => {
    // getBudgetList();
    // getFinancialAdvice();
  }, []);

  return (
    <div>
      {/* {budgetList?.length > 0 ? ( */}
      <div>
        <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
          <div className="">
            <div className="flex mb-2 flex-row space-x-1 items-center ">
              <h2 className="text-md font-bold ">ACE BUDGET AI</h2>
              <Sparkles
                className="rounded-full text-white w-10 h-10 p-2
    bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate"
              />
            </div>
            <h2 className="font-light text-md">
              {/* {financialAdvice || "Loading financial advice..."} */} To
              build financial stability, start by creating a budget that
              prioritizes saving and investing. Set aside an emergency fund with
              at least three months of expenses, and pay off high-interest debt
              quickly.
            </h2>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-7 border rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm">Total Budget</h2>
              <h2 className="font-bold text-2xl">
                {/* ${formatNumber(totalBudget)} */}$11.5k
              </h2>
            </div>
            <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
          </div>
          <div className="p-7 border rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm">Total Spend</h2>
              <h2 className="font-bold text-2xl">
                {/* ${formatNumber(totalSpend)} */}$1.5k
              </h2>
            </div>
            <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
          </div>
          <div className="p-7 border rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm ">No. Of Budget</h2>
              {/* <h2 className="font-bold text-2xl">{budgetList?.length}</h2> */}
              6
            </div>
            <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
          </div>
          <div className="p-7 border rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm">Sum of Income Streams</h2>
              <h2 className="font-bold text-2xl">
                {/* ${formatNumber(totalIncome)} */} $10k
              </h2>
            </div>
            <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
          </div>
        </div>
      </div>
      {/* ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default CardInfo;
