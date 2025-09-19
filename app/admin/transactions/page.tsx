"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Purchase" | "Sale";
  status: "Processing" | "Approved" | "Failed";
  date: string;
  amount: number;
  username?: string;
  userEmail?: string;
  coin?: string;
  paymentProof?: string; // Add optional paymentProof field for deposit receipt image
}

const coinIdMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  TRX: "tron",
  USDT: "tether",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );

        const transactionsWithUsername = savedTransactions.map(
          (tx: Transaction) => ({
            ...tx,
            username: tx.username || "user1",
          })
        );

        // Sort transactions by date (newest first)
        const sortedTransactions = transactionsWithUsername.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    };

    loadTransactions();

    // Listen for storage changes to update transactions
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

  const handleApprove = async (id: string) => {
    try {
      const transactionToApprove = transactions.find(
        (tx: Transaction) => tx.id === id
      );
      if (!transactionToApprove) {
        toast.error("Transaction not found");
        return;
      }

      const userId = transactionToApprove.username || "user1";
      let success = false;

      if (transactionToApprove.type === "Deposit") {
        // Handle deposit approval
        const { DepositApprovalService } = await import(
          "./DepositApprovalService"
        );
        success = await DepositApprovalService.approveDeposit(id, userId);

        if (success) {
          toast.success("Deposit approved and balance updated");
        } else {
          toast.error("Failed to approve deposit");
        }
      } else if (transactionToApprove.type === "Withdrawal") {
        // Handle withdrawal approval
        const { WithdrawalApprovalService } = await import(
          "./WithdrawalApprovalService"
        );
        success = await WithdrawalApprovalService.approveWithdrawal(id, userId);

        if (success) {
          toast.success("Withdrawal approved and balance deducted");
        } else {
          toast.error("Failed to approve withdrawal");
        }
      } else {
        toast.error("Unknown transaction type");
        return;
      }

      if (success) {
        // Refresh transactions from localStorage
        const updatedTransactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("An error occurred while approving the transaction");
    }
  };

  const handleDecline = (id: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((tx) =>
        tx.id === id ? { ...tx, status: "Failed" } : tx
      )
    );

    const updatedTransactions = transactions.map((tx) =>
      tx.id === id ? { ...tx, status: "Failed" } : tx
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const handleClearAllTransactions = () => {
    // Clear transactions from local storage
    localStorage.removeItem("transactions");

    // Clear the transactions state to update the UI
    setTransactions([]);

    // Optionally, reload the page to reflect changes
    window.location.reload();
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toDateString();
  };

  const shortenId = (id: string, length = 6) => {
    return id.length > length ? id.slice(0, length) + "..." : id;
  };

  return (
    <div className="text-gray-50 space-y-6 m-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 border rounded-2xl p-6">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold ">Manage Transactions</h1>
        <Button
          variant="destructive"
          onClick={handleClearAllTransactions}
          className="ml-4 bg-red-600 hover:bg-red-700"
        >
          Clear All Transactions
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount($)</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Amount(crypto)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-sm">
                {shortenId(tx.id)}
              </TableCell>
              <TableCell>
                {tx.type === "Purchase"
                  ? tx.userEmail || "Unknown"
                  : tx.username || "Unknown"}
              </TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.amount.toFixed(2)}</TableCell>
              <TableCell>{tx.coin || "USD"}</TableCell>
              <TableCell>
                {tx.type === "Deposit" || tx.type === "Withdrawal"
                  ? tx.coin && coinPrices[tx.coin.toUpperCase()]
                    ? `${(
                        tx.amount / coinPrices[tx.coin.toUpperCase()]
                      ).toFixed(6)} ${tx.coin.toUpperCase()}`
                    : "Loading..."
                  : tx.coin && coinPrices[tx.coin.toUpperCase()]
                  ? tx.type === "Sale"
                    ? `${tx.amount.toFixed(6)} ${tx.coin}`
                    : `$${(
                        tx.amount * coinPrices[tx.coin.toUpperCase()]
                      ).toFixed(2)}`
                  : "-"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    tx.status === "Approved"
                      ? "bg-green-500/20 text-green-400"
                      : tx.status === "Failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {tx.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  {tx.status === "Processing" && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(tx.id)}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecline(tx.id)}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
