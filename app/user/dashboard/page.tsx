"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
  const [balances, setBalances] = useState({
    USDT: 0,
    ETH: 0,
    BTC: 0,
    SOL: 0,
    TRX: 0,
  });
  const [prices, setPrices] = useState({
    USDT: 1.0,
    ETH: 3000.0,
    SOL: 150.0,
    BTC: 120000.0,
    TRX: 0.1,
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Coin logos - properly sourced from local assets
  const coinLogos = {
    USDT: "/assets/cryptologos/usdt.png",
    ETH: "/assets/cryptologos/eth.png",
    BTC: "/assets/cryptologos/btc.png",
    SOL: "/assets/cryptologos/sol.jpeg",
    TRX: "/assets/cryptologos/trx.png",
  };

  // Load balances from local storage using same approach as deposit page
  useEffect(() => {
    const loadBalancesFromStorage = () => {
      try {
        // Get current user email to use as key (same as deposit page)
        const userEmail = localStorage.getItem("user_session")
          ? JSON.parse(localStorage.getItem("user_session") || "{}").email
          : "default_user";

        const balanceKey = `userBalances_${userEmail}`;
        const storedBalances = localStorage.getItem(balanceKey);

        if (storedBalances) {
          const balances = JSON.parse(storedBalances);
          setBalances({
            USDT: balances.USDT || 0,
            ETH: balances.ETH || 0,
            BTC: balances.BTC || 0,
            SOL: balances.SOL || 0,
            TRX: balances.TRX || 0,
          });
        } else {
          // Initialize with zero balances if no stored data
          const initialBalances = {
            USDT: 0,
            ETH: 0,
            BTC: 0,
            SOL: 0,
            TRX: 0,
          };
          setBalances(initialBalances);
          localStorage.setItem(balanceKey, JSON.stringify(initialBalances));
        }
      } catch (error) {
        console.error("Error loading balances from storage:", error);
        // Fallback to zero balances
        setBalances({
          USDT: 0,
          ETH: 0,
          BTC: 0,
          SOL: 0,
          TRX: 0,
        });
      }
    };

    loadBalancesFromStorage();
  }, []);

  // Fetch real-time cryptocurrency prices and calculate total balance
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,tron&vs_currencies=usd"
        );
        const data = await response.json();

        const newPrices = {
          USDT: data.tether.usd || 1.0,
          ETH: data.ethereum.usd || 4500.0,
          BTC: data.bitcoin.usd || 114000.0,
          SOL: data.solana.usd || 235.0,
          TRX: data.tron.usd || 0.34,
        };

        setPrices(newPrices);

        const total = Object.entries(balances).reduce(
          (sum, [crypto, amount]) => {
            return (
              sum + amount * (newPrices[crypto as keyof typeof newPrices] || 0)
            );
          },
          0
        );

        setTotalBalance(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [balances]);

  // Listen for balance updates from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const userEmail = localStorage.getItem("user_session")
        ? JSON.parse(localStorage.getItem("user_session") || "{}").email
        : "default_user";
      const balanceKey = `userBalances_${userEmail}`;

      if (e.key === balanceKey || e.key === null) {
        const storedBalances = localStorage.getItem(balanceKey);
        if (storedBalances) {
          const balances = JSON.parse(storedBalances);
          setBalances({
            USDT: balances.USDT || 0,
            ETH: balances.ETH || 0,
            BTC: balances.BTC || 0,
            SOL: balances.SOL || 0,
            TRX: balances.TRX || 0,
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const stats = [
    {
      title: "USDT",
      amount: balances.USDT.toFixed(2),
      value: (balances.USDT * prices.USDT).toFixed(2),
      logo: coinLogos.USDT,
    },
    {
      title: "ETH",
      amount: balances.ETH.toFixed(4),
      value: (balances.ETH * prices.ETH).toFixed(2),
      logo: coinLogos.ETH,
    },
    {
      title: "BTC",
      amount: balances.BTC.toFixed(5),
      value: (balances.BTC * prices.BTC).toFixed(2),
      logo: coinLogos.BTC,
    },
    {
      title: "SOL",
      amount: balances.SOL.toFixed(2),
      value: (balances.SOL * prices.SOL).toFixed(2),
      logo: coinLogos.SOL,
    },
    {
      title: "TRX",
      amount: balances.TRX.toFixed(2),
      value: (balances.TRX * prices.TRX).toFixed(2),
      logo: coinLogos.TRX,
    },
  ];

  return (
    <div className="space-y-6 m-5 p-4 border rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
      <h1 className="text-gray-50 text-3xl font-bold mb-6">
        Total Balance :
        <span className="font-bold">
          {loading ? "Loading..." : `$${totalBalance.toFixed(2)}`}
        </span>
      </h1>
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2">Fetching live prices...</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const hoverColors = [
            {
              shadow: "hover:shadow-green-500/20",
              border: "hover:border-green-500/50",
              text: "group-hover:text-green-400",
            },
            {
              shadow: "hover:shadow-blue-500/20",
              border: "hover:border-blue-500/50",
              text: "group-hover:text-blue-400",
            },
            {
              shadow: "hover:shadow-orange-500/20",
              border: "hover:border-orange-500/50",
              text: "group-hover:text-orange-400",
            },
            {
              shadow: "hover:shadow-purple-500/20",
              border: "hover:border-purple-500/50",
              text: "group-hover:text-purple-400",
            },
            {
              shadow: "hover:shadow-red-500/20",
              border: "hover:border-red-500/50",
              text: "group-hover:text-red-400",
            },
          ];
          const color = hoverColors[index % hoverColors.length];
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${color.shadow} ${color.border} group`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-100">
                  {stat.title}
                </CardTitle>
                <Image
                  src={stat.logo}
                  alt={stat.title}
                  width={16}
                  height={16}
                  className="h-4 w-4 rounded-full transition-transform duration-300 group-hover:scale-110"
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-lg font-bold text-white transition-colors duration-300 ${color.text}`}
                >
                  {stat.amount}
                </div>
                <p className="text-xs text-slate-200 mt-2">
                  ≈ ${stat.value} USD
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-sm text-gray-50">
        <p>Real-time price to keep you updated</p>
      </div>
    </div>
  );
};

export default UserDashboard;
