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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, User, Mail, Wallet, DollarSign, Search } from "lucide-react";

interface UserData {
  id: number;
  username: string;
  email: string;
  password: string;
  walletPhrase: string;
  balances: {
    usdt: number;
    eth: number;
    btc: number;
    sol: number;
    trx: number;
  };
  createdAt: string;
}

interface UserCredentials {
  username: string;
  email: string;
  password: string;
  walletPhrases?: string;
  role: string;
  createdAt: string;
}

const USER_CREDENTIALS_KEY = "user_credentials";

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsersFromLocalStorage();
  }, []);

  const loadUsersFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      try {
        const storedCredentials = localStorage.getItem(USER_CREDENTIALS_KEY);
        if (!storedCredentials) {
          setUsers([]);
          return;
        }

        const userCredentials: UserCredentials[] =
          JSON.parse(storedCredentials);

        const transformedUsers: UserData[] = userCredentials.map(
          (user, index) => {
            const balanceKey = `userBalances_${user.email}`;
            const storedBalance = localStorage.getItem(balanceKey);
            const defaultBalances = {
              usdt: 0,
              eth: 0,
              btc: 0,
              sol: 0,
              trx: 0,
            };

            let balances = defaultBalances;

            if (storedBalance) {
              const parsedBalance = JSON.parse(storedBalance);
              balances = {
                usdt: parsedBalance.USDT || 0,
                eth: parsedBalance.ETH || 0,
                btc: parsedBalance.BTC || 0,
                sol: parsedBalance.SOL || 0,
                trx: parsedBalance.TRX || 0,
              };
            }

            return {
              id: index + 1,
              username: user.username,
              email: user.email,
              password: user.password,
              walletPhrase: user.walletPhrases || "",
              balances,
              createdAt:
                user.createdAt || new Date().toISOString().split("T")[0],
            };
          }
        );

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error loading users from localStorage:", error);
        setUsers([]);
      }
    }
  };

  const saveUsersToLocalStorage = (updatedUsers: UserData[]) => {
    if (typeof window !== "undefined") {
      try {
        // Convert UserData[] to UserCredentials[]
        const userCredentials: UserCredentials[] = updatedUsers.map((user) => ({
          username: user.username,
          email: user.email,
          password: user.password,
          walletPhrases: user.walletPhrase,
          role: "user", // Assuming all are users
          createdAt: user.createdAt,
        }));

        // Save user credentials
        localStorage.setItem(
          USER_CREDENTIALS_KEY,
          JSON.stringify(userCredentials)
        );

        // Save balances for each user
        updatedUsers.forEach((user) => {
          const balanceKey = `userBalances_${user.email}`;
          const balanceData = {
            USDT: user.balances.usdt,
            ETH: user.balances.eth,
            BTC: user.balances.btc,
            SOL: user.balances.sol,
            TRX: user.balances.trx,
          };
          localStorage.setItem(balanceKey, JSON.stringify(balanceData));
        });
      } catch (error) {
        console.error("Error saving users to localStorage:", error);
      }
    }
  };

  const handleSave = (updatedUser: UserData) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "btc" ? "BTC" : "USD",
      minimumFractionDigits: currency === "btc" ? 5 : 2,
      maximumFractionDigits: currency === "btc" ? 5 : 2,
    }).format(value);
  };

  const MobileUserCard = ({ user }: { user: UserData }) => (
    <Card className="mb-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-white">
              {user.username}
            </CardTitle>
            <p className="text-sm text-slate-300">{user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">ID: {user.id}</p>
            <p className="text-xs text-slate-400">{user.createdAt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">
              Balances
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-400" />
                <span className="text-slate-200">
                  USDT: {formatCurrency(user.balances.usdt, "usdt")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">ETH: {user.balances.eth}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">BTC: {user.balances.btc}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">SOL: {user.balances.sol}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">TRX: {user.balances.trx}</span>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:text-white"
              onClick={() => setEditingUser(user)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="text-gray-50 space-y-6 m-1 border rounded-2xl p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">User Management</h1>
          <p>Manage and monitor all platform users</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-200 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700  placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                {users.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total USDT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-green-400">
                {formatCurrency(
                  users.reduce((sum, user) => sum + user.balances.usdt, 0),
                  "usdt"
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total ETH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                {users
                  .reduce((sum, user) => sum + user.balances.eth, 0)
                  .toFixed(4)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total BTC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-orange-400">
                {users
                  .reduce((sum, user) => sum + user.balances.btc, 0)
                  .toFixed(5)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total SOL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-purple-400">
                {users
                  .reduce((sum, user) => sum + user.balances.sol, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/50 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total TRX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-red-400">
                {users
                  .reduce((sum, user) => sum + user.balances.trx, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:hidden">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              Users ({filteredUsers.length})
            </h2>
          </div>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <MobileUserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">
                No users found matching your search.
              </p>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-xl font-semibold text-white">
                User List ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800/50 border-slate-700/50">
                      <TableHead className="font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          User
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-400" />
                          Email
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-purple-400" />
                          Balances
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-300">
                        Joined
                      </TableHead>
                      <TableHead className="font-semibold text-slate-300 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">
                              {user.username}
                            </div>
                            <div className="text-sm text-slate-400">
                              ID: {user.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-3 w-3 text-green-400" />
                              <span className="text-slate-200">
                                USDT:{" "}
                                {formatCurrency(user.balances.usdt, "usdt")}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              ETH: {user.balances.eth} | BTC:{" "}
                              {user.balances.btc} | SOL: {user.balances.sol} |
                              TRX: {user.balances.trx}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {user.createdAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">
                    No users found matching your search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {editingUser && (
          <Dialog
            open={!!editingUser}
            onOpenChange={() => setEditingUser(null)}
          >
            <DialogContent className="sm:max-w-[95vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-xl text-white">
                  Edit User: {editingUser.username}
                </DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4 text-white"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSave({
                    ...editingUser,
                    username: formData.get("username") as string,
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                    walletPhrase: formData.get("walletPhrase") as string,
                    balances: {
                      usdt: parseFloat(formData.get("usdt") as string),
                      eth: parseFloat(formData.get("eth") as string),
                      btc: parseFloat(formData.get("btc") as string),
                      sol: parseFloat(formData.get("sol") as string),
                      trx: parseFloat(formData.get("trx") as string),
                    },
                  });
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-slate-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      defaultValue={editingUser.username}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={editingUser.email}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="text"
                      defaultValue={editingUser.password}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="walletPhrase" className="text-slate-300">
                      Wallet Phrase
                    </Label>
                    <Input
                      id="walletPhrase"
                      name="walletPhrase"
                      defaultValue={editingUser.walletPhrase}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-slate-300">
                    Balances
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="usdt" className="text-slate-300">
                        USDT
                      </Label>
                      <Input
                        id="usdt"
                        name="usdt"
                        type="number"
                        step="0.01"
                        defaultValue={editingUser.balances.usdt}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eth" className="text-slate-300">
                        ETH
                      </Label>
                      <Input
                        id="eth"
                        name="eth"
                        type="number"
                        step="0.001"
                        defaultValue={editingUser.balances.eth}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="btc" className="text-slate-300">
                        BTC
                      </Label>
                      <Input
                        id="btc"
                        name="btc"
                        type="number"
                        step="0.0001"
                        defaultValue={editingUser.balances.btc}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sol" className="text-slate-300">
                        SOL
                      </Label>
                      <Input
                        id="sol"
                        name="sol"
                        type="number"
                        step="0.01"
                        defaultValue={editingUser.balances.sol}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trx" className="text-slate-300">
                        TRX
                      </Label>
                      <Input
                        id="trx"
                        name="trx"
                        type="number"
                        step="0.01"
                        defaultValue={editingUser.balances.trx}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
