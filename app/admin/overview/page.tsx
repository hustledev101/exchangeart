"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession, getUserCredentials } from "@/lib/localStorageUtils";
import { Users, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal";
  status: "Processing" | "Approved" | "Failed";
  date: string;
  amount: number;
  username?: string;
  coin?: string;
}

export default function AdminOverview() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminData = () => {
      try {
        // Get user credentials from localStorage using utility function
        const userCredentials = getUserCredentials();
        setTotalUsers(userCredentials.length);

        // Get current admin session
        const adminSession = getAdminSession();
        setAdminEmail(adminSession?.email || null);

        // Get transactions from localStorage
        const storedTransactions = localStorage.getItem("transactions");
        const transactions: Transaction[] = storedTransactions
          ? JSON.parse(storedTransactions)
          : [];

        // Count pending deposits
        const pendingDepositsCount = transactions.filter(
          (tx: Transaction) =>
            tx.type === "Deposit" && tx.status === "Processing"
        ).length;
        setPendingDeposits(pendingDepositsCount);

        // Count pending withdrawals
        const pendingWithdrawalsCount = transactions.filter(
          (tx: Transaction) =>
            tx.type === "Withdrawal" && tx.status === "Processing"
        ).length;
        setPendingWithdrawals(pendingWithdrawalsCount);
      } catch (error) {
        console.error("Error loading admin data:", error);
        // Fallback to 0 if there's an error
        setTotalUsers(0);
        setPendingDeposits(0);
        setPendingWithdrawals(0);
        setAdminEmail(null);
      } finally {
        setLoading(false);
      }
    };

    // Load data on component mount
    loadAdminData();

    // No need for storage event listener since no localStorage
  }, []);

  if (loading) {
    return (
      <div className="font-mono space-y-6 m-5">
        <h1 className="text-3xl font-bold text-[#F9FAFA]">Admin Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-600 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-slate-600 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-600 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-50 font-mono space-y-6 m-5 border rounded-2xl p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
      <h1 className="text-3xl font-bold ">Admin Overview</h1>
      {adminEmail && (
        <div className="mb-4 text-sm text-slate-300">
          Logged in as: <span className="font-semibold">{adminEmail}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <Card
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all 
        duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
              {totalUsers}
            </div>
            <p className="text-xs text-slate-200 mt-2">
              Active users in the system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Pending Deposits
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-green-400 transition-transform duration-300 group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white transition-colors duration-300 group-hover:text-green-400">
              {pendingDeposits}
            </div>
            <p className="text-xs text-slate-200 mt-2">
              Awaiting deposit confirmations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Pending Withdrawals
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white transition-colors duration-300 group-hover:text-orange-400">
              {pendingWithdrawals}
            </div>
            <p className="text-xs text-slate-200 mt-2">
              Withdrawals in processing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
