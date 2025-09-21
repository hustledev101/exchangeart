"use client";
import React, { useState, useEffect } from "react";

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Sale";
  status: "Processing" | "Approved" | "Failed";
  date: string;
  amount: number;
  coin?: string;
  walletAddress?: string;
  userEmail?: string;
}

const coinIdMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  TRX: "tron",
  USDT: "tether",
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toDateString();
};

const shortenId = (id: string, length = 6) => {
  return id.length > length ? id.slice(0, length) + "..." : id;
};

const getAmountColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "text-green-400";
    case "Processing":
      return "text-yellow-400";
    case "Failed":
      return "text-red-500";
    default:
      return "text-white";
  }
};

// Helper function to get current user email
const getCurrentUserEmail = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem("user_session");
    if (session) {
      const userData = JSON.parse(session);
      return userData.email || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const userEmail = getCurrentUserEmail();
        setCurrentUserEmail(userEmail);

        if (!userEmail) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const savedTransactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );

        const userTransactions = savedTransactions.filter(
          (txn: Transaction) => txn.userEmail === userEmail
        );

        // New users get empty transaction history
        if (userTransactions.length === 0) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const sortedTransactions = userTransactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(sortedTransactions);
        setLoading(false);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
        setLoading(false);
      }
    };

    loadTransactions();

    // Listen for storage changes to update transactions in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "transactions" || e.key === null) {
        loadTransactions();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        // Get unique coins from transactions
        const uniqueCoins = Array.from(
          new Set(
            transactions
              .map((tx) => tx.coin)
              .filter((coin): coin is string => Boolean(coin))
          )
        );

        if (uniqueCoins.length === 0) {
          setCoinPrices({});
          return;
        }

        // Map coins to CoinGecko IDs
        const coinIds = uniqueCoins
          .map((coin) => coinIdMap[coin.toUpperCase()])
          .filter(Boolean)
          .join(",");

        if (!coinIds) {
          setCoinPrices({});
          return;
        }

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );
        const data = await response.json();

        // Map back to coin symbol prices
        const prices: Record<string, number> = {};
        uniqueCoins.forEach((coin) => {
          const id = coinIdMap[coin.toUpperCase()];
          if (id && data[id]) {
            prices[coin.toUpperCase()] = data[id].usd;
          }
        });

        setCoinPrices(prices);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
        setCoinPrices({});
      }
    };

    fetchCoinPrices();
  }, [transactions]);

  if (loading) {
    return (
      <div className="min-h-screen w-full px-4 sm:px-6 md:px-10 py-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-10 py-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 text-gray-50">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {currentUserEmail && (
        <p className="text-sm text-gray-100 mb-4">
          Showing transactions for: {currentUserEmail}
        </p>
      )}

      {/* Table for medium+ screens */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="text-gray-00">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-right">Amount</th>
              <th className="py-2 px-4">Currency</th>
              <th className="py-2 px-4">Amount (Crypto)</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No transactions found. Make a deposit or withdrawal to see
                  your transaction history.
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr key={txn.id} className="border-t border-gray-800">
                  <td className="py-2 px-4 font-semibold">{index + 1}</td>
                  <td className="py-2 px-4">
                    <span className="bg-gray-800 px-3 py-1 rounded text-sm font-semibold">
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        txn.status === "Approved"
                          ? "bg-green-800"
                          : txn.status === "Processing"
                          ? "bg-yellow-800"
                          : "bg-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    <div className={`text-right ${getAmountColor(txn.status)}`}>
                      {txn.type === "Deposit" || txn.type === "Withdrawal"
                        ? `$${txn.amount.toFixed(2)}`
                        : txn.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-2 px-4">{txn.coin || "USD"}</td>
                  <td className="py-2 px-4">
                    {txn.coin
                      ? txn.type === "Sale"
                        ? `${txn.amount.toFixed(6)} ${txn.coin}`
                        : coinPrices[txn.coin.toUpperCase()]
                        ? `${(
                            txn.amount / coinPrices[txn.coin.toUpperCase()]
                          ).toFixed(6)} ${txn.coin}`
                        : "Refreshing..."
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">{formatDate(txn.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card view */}
      <div className="md:hidden w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No transactions found. Make a deposit or withdrawal to see your
            transaction history.
          </p>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn.id}
              className="w-full bg-[#1A1B25] border border-gray-700 rounded p-4"
            >
              <p className="text-sm text-gray-400 mb-1">
                ID: {shortenId(txn.id, 10)}
              </p>
              <p className="text-base font-bold">{txn.type}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span className="font-semibold text-white">{txn.status}</span>
              </p>
              <p className="text-sm mt-1">Date: {formatDate(txn.date)}</p>
              <p className="text-right mt-2 font-bold text-lg">
                {txn.type === "Deposit" || txn.type === "Withdrawal"
                  ? `$${txn.amount.toFixed(2)}`
                  : txn.amount.toFixed(2)}
              </p>
              <p className="text-right mt-1 text-sm">{txn.coin || "USD"}</p>
              {txn.coin && (
                <p className="text-right mt-1 text-sm text-gray-400">
                  {txn.type === "Sale"
                    ? `${txn.amount.toFixed(6)} ${txn.coin}`
                    : coinPrices[txn.coin.toUpperCase()]
                    ? `${(
                        txn.amount / coinPrices[txn.coin.toUpperCase()]
                      ).toFixed(6)} ${txn.coin}`
                    : "Refreshing..."}
                </p>
              )}
              {txn.walletAddress && (
                <p className="text-xs text-gray-400 mt-1">
                  Address: {shortenId(txn.walletAddress, 10)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
