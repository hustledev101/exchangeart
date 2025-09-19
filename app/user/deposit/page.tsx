"use client";
import { useState, useEffect } from "react";
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
import Image from "next/image";
import { Copy } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaInfoCircle } from "react-icons/fa";

interface WalletData {
  address: string;
  qrCode: string;
}

interface UserWallets {
  eth: WalletData;
  btc: WalletData;
  sol: WalletData;
  usdt: WalletData;
  trx: WalletData;
}

const initialWallets: UserWallets = {
  eth: { address: "", qrCode: "" },
  btc: { address: "", qrCode: "" },
  sol: { address: "", qrCode: "" },
  usdt: { address: "", qrCode: "" },
  trx: { address: "", qrCode: "" },
};

type Currency = keyof UserWallets;

export default function Deposit() {
  const [userWallets, setUserWallets] = useState<UserWallets>(initialWallets);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("eth");
  const [amount, setAmount] = useState("");
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
    SOL: 235.0,
    BTC: 114500.0,
    TRX: 0.34,
  });
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);

  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch default wallet addresses and images set by admin
  useEffect(() => {
    const fetchDefaultWallets = () => {
      try {
        const storedWallets = localStorage.getItem("adminWallets");
        if (storedWallets) {
          const adminWallets = JSON.parse(storedWallets);
          setUserWallets({
            eth: {
              address: adminWallets.eth?.address || "",
              qrCode: adminWallets.eth?.image || "",
            },
            btc: {
              address: adminWallets.btc?.address || "",
              qrCode: adminWallets.btc?.image || "",
            },
            sol: {
              address: adminWallets.sol?.address || "",
              qrCode: adminWallets.sol?.image || "",
            },
            usdt: {
              address: adminWallets.usdt?.address || "",
              qrCode: adminWallets.usdt?.image || "",
            },
            trx: {
              address: adminWallets.trx?.address || "",
              qrCode: adminWallets.trx?.image || "",
            },
          });
        } else {
          toast.info("No wallet addresses assigned. Please contact support.");
        }
      } catch (error) {
        console.error("Error fetching default wallets:", error);
        toast.error("Failed to load wallet information");
      }
    };

    fetchDefaultWallets();
  }, []);

  // Load balances from local storage
  useEffect(() => {
    const loadBalancesFromStorage = () => {
      try {
        // Get current user email to use as key
        const userEmail = localStorage.getItem("user_session")
          ? JSON.parse(localStorage.getItem("user_session") || "{}").email
          : "default_user";

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
          USDT: data.tether.usd,
          ETH: data.ethereum.usd,
          BTC: data.bitcoin.usd,
          SOL: data.solana.usd,
          TRX: data.tron.usd,
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
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [balances]);

  const copyToClipboard = async () => {
    try {
      const address = userWallets[selectedCurrency]?.address;
      if (!address) throw new Error("No wallet address available");
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("Wallet address copied to clipboard!", { autoClose: 1000 });
    } catch (error) {
      toast.error("Failed to copy wallet address", { autoClose: 1000 });
    }
  };

  // Calculate crypto amount when amount or currency changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const fiatAmount = parseFloat(amount);
      const cryptoPrice =
        prices[selectedCurrency.toUpperCase() as keyof typeof prices];

      if (cryptoPrice > 0) {
        const calculatedCryptoAmount = fiatAmount / cryptoPrice;
        setCryptoAmount(calculatedCryptoAmount.toFixed(6));
        setConversionRate(cryptoPrice);
      }
    } else {
      setCryptoAmount("");
      setConversionRate(0);
    }
  }, [amount, selectedCurrency, prices]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Remove required check for paymentProof to make it optional
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const depositAmount = parseFloat(amount);
      const cryptoPrice =
        prices[selectedCurrency.toUpperCase() as keyof typeof prices];
      const cryptoAmount = depositAmount / cryptoPrice;

      // Create transaction data with both fiat and crypto amounts
      const transactionData = {
        id: `DEP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        type: "Deposit" as const,
        amount: depositAmount, // Fiat amount in USD
        cryptoAmount: cryptoAmount, // Crypto amount to be credited
        currency: selectedCurrency.toUpperCase(),
        status: "Processing" as const,
        date: new Date().toISOString(),
        coin: selectedCurrency.toUpperCase(),
        walletAddress: userWallets[selectedCurrency]?.address || "",
        conversionRate: cryptoPrice, // Store the conversion rate at time of deposit
        username: localStorage.getItem("user_session")
          ? JSON.parse(localStorage.getItem("user_session") || "{}").email
          : "default_user",
        userEmail: localStorage.getItem("user_session")
          ? JSON.parse(localStorage.getItem("user_session") || "{}").email
          : "default_user",
        originalAmount: depositAmount,
        originalCurrency: "USD",
        estimatedValueUSD: depositAmount,
        cryptoEquivalent: cryptoAmount,
        timestamp: Date.now(),
      };

      // Save to localStorage
      const existingTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );

      const updatedTransactions = [transactionData, ...existingTransactions];
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

      console.log("Deposit transaction saved:", transactionData);

      toast.success("Your deposit is processing");

      setAmount("");
      setCryptoAmount("");
    } catch (error) {
      console.error("Error submitting deposit:", error);
      toast.error("An error occurred while processing your deposit");
    }
  };

  return (
    <div className="text-gray-50 space-y-6 m-5 p-4 border rounded-2xl bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
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
      <h1 className="text-3xl font-bold mb-6">Fund Wallet</h1>
      {/* Total Balance */}
      <h2 className="text-xl sm:text-xl font-bold mb-6">
        Total Balance:{" "}
        <span className="font-bold">${totalBalance.toFixed(2)}</span>
      </h2>
      {/* Balance Display */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Wallet Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              title: "USDT",
              amount: balances.USDT.toFixed(2),
              value: (balances.USDT * prices.USDT).toFixed(2),
              logo: "/assets/cryptologos/usdt.png",
            },
            {
              title: "ETH",
              amount: balances.ETH.toFixed(4),
              value: (balances.ETH * prices.ETH).toFixed(2),
              logo: "/assets/cryptologos/eth.png",
            },
            {
              title: "BTC",
              amount: balances.BTC.toFixed(8),
              value: (balances.BTC * prices.BTC).toFixed(2),
              logo: "/assets/cryptologos/btc.png",
            },
            {
              title: "SOL",
              amount: balances.SOL.toFixed(2),
              value: (balances.SOL * prices.SOL).toFixed(2),
              logo: "/assets/cryptologos/sol.png",
            },
            {
              title: "TRX",
              amount: balances.TRX.toFixed(2),
              value: (balances.TRX * prices.TRX).toFixed(2),
              logo: "/assets/cryptologos/trx.png",
            },
          ].map((stat, index) => {
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
      <div className="gap-6 items-start">
        {/* Select Currency */}
        <div className="mb-2">
          <Label htmlFor="currency" className="m-1">
            Select Currency
          </Label>
          <Select
            value={selectedCurrency}
            onValueChange={(value) => setSelectedCurrency(value as Currency)}
          >
            <SelectTrigger
              id="currency"
              className="bg-[#2A2B35] border-gray-600 text-white"
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2B35] text-white border-gray-600">
              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
              <SelectItem value="sol">Solana (SOL)</SelectItem>
              <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
              <SelectItem value="usdt">Tether (USDT ERC20)</SelectItem>
              <SelectItem value="trx">Tron (TRX)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wallet Details Section */}
        <div className="bg-[#2A2B35] p-6 rounded-lg mb-5">
          <h2 className="text-xl font-bold mb-4">Wallet Details</h2>
          {/* Wallet Address */}
          <div className=" mb-4">
            <Label>Wallet Address</Label>
            <div className="flex items-center gap-2 mt-1 border p-1">
              <p className="text-sm break-all flex-1 text-white">
                {userWallets[selectedCurrency]?.address || "Not assigned"}
              </p>
              {userWallets[selectedCurrency]?.address && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="text-white hover:text-blue-400"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="p-2 mt-2 flex text-sm bg-yellow-900 rounded">
              <FaInfoCircle size={20} className="text-yellow-500 mr-1" />
              <p>
                Only send{" "}
                <span className="uppercase">
                  &quot;{selectedCurrency}&quot;
                </span>
                to this address. Other assets sent to this address will be lost.
              </p>
            </div>
          </div>
          {/* QR Code */}
          {userWallets[selectedCurrency]?.qrCode && (
            <div>
              <Label>Wallet QR Code</Label>
              <div className="mt-2 border rounded">
                <Image
                  src={userWallets[selectedCurrency].qrCode}
                  alt={`${selectedCurrency} QR Code`}
                  width={150}
                  height={150}
                  className="rounded"
                />
              </div>
              <p className="text-gray-50 text-sm m-5">
                Scan this QR code to make a deposit.
              </p>
            </div>
          )}
        </div>
        {/* Deposit Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-lg">
            {/* Deposit Amount */}
            <div className="mb-4">
              <Label htmlFor="amount" className="m-1">
                Deposit Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <p className="text-gray-50 text-sm mt-1">
                Enter the amount you wish to deposit.
              </p>
              {cryptoAmount && parseFloat(amount) > 0 && (
                <div className="mt-2 p-3 rounded-md border border-gray-600">
                  <p className="text-sm text-gray-100">
                    You will receive:{" "}
                    <span className="font-bold text-[#3ee246]">
                      {cryptoAmount} {selectedCurrency.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-100 mt-1">
                    Conversion Rate: 1 {selectedCurrency.toUpperCase()} = $
                    {conversionRate.toFixed(2)} USD
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full font-bold py-3 rounded bg-blue-900 hover:bg-blue-800 text-white"
              disabled={!userWallets[selectedCurrency]?.address}
            >
              Deposit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
