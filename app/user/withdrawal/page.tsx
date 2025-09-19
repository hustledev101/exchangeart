"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WithdrawalPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState("USDT");
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState({
    USDT: 0,
    ETH: 0,
    BTC: 0,
    SOL: 0,
    TRX: 0,
  });
  const [prices, setPrices] = useState({
    USDT: 1.0,
    ETH: 4500.0,
    SOL: 2350.0,
    BTC: 114500.0,
    TRX: 0.34,
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [convertedAmount, setConvertedAmount] = useState("");
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tronAmount, setTronAmount] = useState(0);
  const [trxPrice, setTrxPrice] = useState(0);
  const [tronAddress, setTronAddress] = useState(
    "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuW9"
  );
  const [tronImage, setTronImage] = useState("/assets/trx-qr.png");

  // Get user email for consistent storage key
  const getUserEmail = () => {
    try {
      return localStorage.getItem("user_session")
        ? JSON.parse(localStorage.getItem("user_session") || "{}").email
        : "default_user";
    } catch {
      return "default_user";
    }
  };

  // Load admin wallets from localStorage
  const loadAdminWallets = () => {
    try {
      const storedWallets = localStorage.getItem("adminWallets");
      if (storedWallets) {
        const parsedWallets = JSON.parse(storedWallets);
        if (parsedWallets.trx) {
          setTronAddress(
            parsedWallets.trx.address || "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuW9"
          );
          setTronImage(parsedWallets.trx.image || "/assets/trx-qr.png");
        }
      }
    } catch (error) {
      console.error("Error loading admin wallets:", error);
      // Fallback to default values
      setTronAddress("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuW9");
      setTronImage("/assets/trx-qr.png");
    }
  };

  // Coin logos
  const coinLogos = {
    USDT: "/assets/cryptologos/usdt.png",
    ETH: "/assets/cryptologos/eth.png",
    BTC: "/assets/cryptologos/btc.png",
    SOL: "/assets/cryptologos/sol.png",
    TRX: "/assets/cryptologos/trx.png",
  };

  // Load balances from storage (consistent with deposit page)
  const loadBalancesFromStorage = () => {
    try {
      const userEmail = getUserEmail();
      const balanceKey = `userBalances_${userEmail}`;
      const storedBalances = localStorage.getItem(balanceKey);

      if (storedBalances) {
        const parsedBalances = JSON.parse(storedBalances);
        setBalances({
          USDT: parsedBalances.USDT || 0,
          ETH: parsedBalances.ETH || 0,
          BTC: parsedBalances.BTC || 0,
          SOL: parsedBalances.SOL || 0,
          TRX: parsedBalances.TRX || 0,
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

  // Update balance in storage (consistent with deposit page)
  const updateBalanceInStorage = (
    currency: string,
    amount: number,
    isWithdrawal: boolean = true
  ) => {
    try {
      const userEmail = getUserEmail();
      const balanceKey = `userBalances_${userEmail}`;
      const currentBalances = JSON.parse(
        localStorage.getItem(balanceKey) || "{}"
      );

      const updatedBalances = {
        ...currentBalances,
        [currency.toUpperCase()]: Math.max(
          0,
          (currentBalances[currency.toUpperCase()] || 0) +
            (isWithdrawal ? -amount : amount)
        ),
      };

      setBalances(updatedBalances);
      localStorage.setItem(balanceKey, JSON.stringify(updatedBalances));

      // Dispatch storage event for cross-tab synchronization
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: balanceKey,
          newValue: JSON.stringify(updatedBalances),
        })
      );
    } catch (error) {
      console.error("Error updating balance in storage:", error);
    }
  };

  // Fetch user balances and prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load admin wallets
        loadAdminWallets();

        // Load balances using consistent method
        loadBalancesFromStorage();

        // Fetch real-time prices
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,tron&vs_currencies=usd"
        );
        const data = await response.json();

        const newPrices = {
          USDT: data.tether.usd,
          ETH: data.ethereum.usd,
          BTC: data.bitcoin.usd,
          SOL: data.solana.usd,
          TRX: data.tron.usd,
        };

        setTrxPrice(data.tron.usd);

        setPrices(newPrices);

        // Calculate total balance
        const userEmail = getUserEmail();
        const balanceKey = `userBalances_${userEmail}`;
        const storedBalances = localStorage.getItem(balanceKey);

        const currentBalances = storedBalances
          ? JSON.parse(storedBalances)
          : balances;
        const total = Object.entries(currentBalances).reduce(
          (sum, [crypto, amount]) => {
            return (
              sum +
              (amount as number) * newPrices[crypto as keyof typeof newPrices]
            );
          },
          0
        );

        setTotalBalance(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      const userEmail = getUserEmail();
      const balanceKey = `userBalances_${userEmail}`;
      if (e.key === balanceKey || e.key === null) {
        loadBalancesFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Calculate estimated fee and net amount
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const usdAmount = parseFloat(amount);
      const cryptoAmount = usdAmount / prices[coin as keyof typeof prices];

      // Estimated withdrawal fee (5% of withdrawal amount)
      const fee = usdAmount * 0.05;

      setEstimatedFee(fee);
      setConvertedAmount(cryptoAmount.toFixed(6));
    } else {
      setEstimatedFee(0);
      setNetAmount(0);
      setConvertedAmount("");
    }
  }, [amount, coin, prices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !walletAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    const withdrawalAmount = parseFloat(amount);

    if (withdrawalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if user has sufficient balance for net amount (after fee)
    const selectedBalance = balances[coin as keyof typeof balances];
    const cryptoAmount = withdrawalAmount / prices[coin as keyof typeof prices];

    if (cryptoAmount > selectedBalance) {
      toast.error(
        `Insufficient ${coin} balance. Available: ${selectedBalance.toFixed(
          6
        )} ${coin}`
      );
      return;
    }

    // Calculate Tron amount (2% of withdrawal amount in TRX)
    const tronDepositAmount = (withdrawalAmount * 0.02) / trxPrice;
    setTronAmount(tronDepositAmount);

    // Check if user has sufficient TRX for network fee
    if (balances.TRX >= tronDepositAmount) {
      // Sufficient TRX - show confirmation dialog
      setConfirmDialogOpen(true);
    } else {
      // Insufficient TRX - show deposit dialog
      setDialogOpen(true);
    }
  };

  const confirmWithdrawal = async (
    event?: React.MouseEvent<HTMLButtonElement>,
    deductTrxFee: boolean = false
  ) => {
    const withdrawalAmount = parseFloat(amount);
    const cryptoAmount = withdrawalAmount / prices[coin as keyof typeof prices];

    const withdrawalData = {
      id: `WTH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "Withdrawal" as const,
      status: "Processing" as const,
      date: new Date().toISOString(),
      amount: withdrawalAmount, // Use USD amount instead of crypto amount
      coin: coin,
      walletAddress,
      requestedAmount: withdrawalAmount, // Store USD amount (redundant but kept for compatibility)
      fee: estimatedFee,
      netAmount: netAmount,
      username: getUserEmail(),
      userEmail: getUserEmail(),
      timestamp: Date.now(),
    };

    try {
      // If sufficient TRX balance, deduct the network fee
      if (deductTrxFee) {
        updateBalanceInStorage("TRX", tronAmount, true); // Deduct TRX fee
      }

      // Store transaction - DO NOT deduct withdrawal balance yet
      const existingTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      existingTransactions.push(withdrawalData);
      localStorage.setItem(
        "transactions",
        JSON.stringify(existingTransactions)
      );

      // Balance will be deducted when admin approves the transaction
      toast.success(
        `Your withdrawal request of ${cryptoAmount.toFixed(
          6
        )} ${coin} is processing`
      );

      // Reset form
      setAmount("");
      setWalletAddress("");
      setDialogOpen(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Error processing withdrawal. Please try again.");
    }
  };

  const balanceCards = [
    {
      title: "ETH",
      amount: balances.ETH.toFixed(4),
      value: (balances.ETH * prices.ETH).toFixed(2),
      logo: coinLogos.ETH,
    },
    {
      title: "SOL",
      amount: balances.SOL.toFixed(2),
      value: (balances.SOL * prices.SOL).toFixed(2),
      logo: coinLogos.SOL,
    },
    {
      title: "USDT",
      amount: balances.USDT.toFixed(2),
      value: (balances.USDT * prices.USDT).toFixed(2),
      logo: coinLogos.USDT,
    },
    {
      title: "BTC",
      amount: balances.BTC.toFixed(6),
      value: (balances.BTC * prices.BTC).toFixed(2),
      logo: coinLogos.BTC,
    },
    {
      title: "TRX",
      amount: balances.TRX.toFixed(2),
      value: (balances.TRX * prices.TRX).toFixed(2),
      logo: coinLogos.TRX,
    },
  ];

  return (
    <div className="text-gray-50 space-y-6 m-5 p-4 border rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h1 className="text-3xl font-bold mb-6">Make a Withdrawal</h1>

      {/* Balance Display */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Wallet Balances</h3>
        <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-5 gap-6">
          {balanceCards.map((stat, index) => {
            const hoverColors = [
              {
                shadow: "hover:shadow-blue-500/20",
                border: "hover:border-blue-500/50",
                text: "group-hover:text-blue-400",
              },
              {
                shadow: "hover:shadow-green-500/20",
                border: "hover:border-green-500/50",
                text: "group-hover:text-green-400",
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
            ];
            const color = hoverColors[index % hoverColors.length];
            return (
              <Card
                key={index}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${color.shadow} ${color.border} group cursor-pointer`}
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
                    className="h-5 w-5 rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-xl font-bold text-white transition-colors duration-300 ${color.text}`}
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
      </div>

      {/**Gas fee */}
      <div>
        <p>Network Fee(Gas Fee): </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="p-6 rounded-lg">
          {/* Select Coin */}
          <div className="mb-4">
            <Label htmlFor="coin">Select Coin</Label>
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger id="coin" className="w-full">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="TRX">Tron (TRX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <Label htmlFor="amount">Amount (USD)</Label>
            <p className="text-gray-50 text-sm mt-1">
              Enter the amount you wish to withdraw.
            </p>
            <p className="text-xs font-bold text-gray-50 mt-1">
              Available: {balances[coin as keyof typeof balances]} {coin}
            </p>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
              className="w-full"
              required
            />
            {convertedAmount && parseFloat(amount) > 0 && (
              <div className="mt-2 p-3 rounded-md border border-gray-600">
                <p className="text-xs text-gray-50 mt-1">
                  Network Fee(Gas Fee): -${estimatedFee.toFixed(2)} | Net: $
                  {netAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div className="mb-4">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your withdrawal wallet address"
              className="w-full"
              required
            />
            <p className="text-gray-50 text-sm mt-1">
              Enter the wallet address for withdrawal.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-bold py-3 rounded bg-blue-900 hover:bg-blue-800 text-white"
          >
            Withdraw
          </Button>
        </form>
      </div>

      {/* Tron Deposit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Withdrawal</DialogTitle>
            <DialogDescription>
              To complete your withdrawal, please deposit{" "}
              {tronAmount.toFixed(6)} TRX for Network Fee(Gas fee).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tron Wallet Address:</Label>
              <p className="text-sm text-gray-600">{tronAddress}</p>
            </div>
            <div>
              <Label>QR Code:</Label>
              <Image
                src={tronImage}
                alt="Tron QR Code"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Sufficient TRX */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              You&apos;ll be charged {tronAmount.toFixed(6)} TRX for Network
              Fee(Gas fee). Proceed with withdrawal?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmWithdrawal(undefined, true)}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalPage;
