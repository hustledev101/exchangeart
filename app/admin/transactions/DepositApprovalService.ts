// Deposit Approval Service
// Handles deposit approval and wallet balance updates with improved logic

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal";
  status: "Processing" | "Approved" | "Failed";
  date: string;
  amount: number;
  username?: string;
  coin?: string;
}

interface BalanceUpdate {
  userId: string;
  currency: string;
  amount: number;
  transactionId: string;
}

interface CurrencyRates {
  [key: string]: number;
}

// Event emitter for balance updates
interface BalanceUpdateEvent {
  userId: string;
  currency: string;
  amount: number;
  transactionId: string;
  timestamp: number;
  type: string;
  usdAmount: number;
}

class BalanceUpdateEventEmitter {
  private listeners: Map<string, ((data: BalanceUpdateEvent) => void)[]> =
    new Map();

  on(event: string, callback: (data: BalanceUpdateEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: BalanceUpdateEvent) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => callback(data));
    }
  }

  off(event: string, callback: (data: BalanceUpdateEvent) => void) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const balanceUpdateEmitter = new BalanceUpdateEventEmitter();

export class DepositApprovalService {
  private static readonly CURRENCY_RATES: CurrencyRates = {
    ETH: 4500.0,
    SOL: 230.0,
    BTC: 114500.0,
    USDT: 1.0,
    TRX: 0.35,
  };

  private static readonly COINGECKO_IDS: { [key: string]: string } = {
    ETH: "ethereum",
    SOL: "solana",
    BTC: "bitcoin",
    USDT: "tether",
    TRX: "tron",
  };

  private static cachedRates: CurrencyRates | null = null;
  private static ratesTimestamp: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static readonly STORAGE_KEYS = {
    TRANSACTIONS: "transactions",
    USER_BALANCES: (userId: string) => `userBalances_${userId}`,
  };

  /**
   * Fetch currency rates from CoinGecko API
   */
  private static async fetchCurrencyRates(): Promise<CurrencyRates> {
    if (
      this.cachedRates &&
      Date.now() - this.ratesTimestamp < this.CACHE_DURATION
    ) {
      return this.cachedRates;
    }

    try {
      const ids = Object.values(this.COINGECKO_IDS).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      const data = await response.json();
      const rates: CurrencyRates = {};
      for (const [symbol, id] of Object.entries(this.COINGECKO_IDS)) {
        rates[symbol] = data[id]?.usd || this.CURRENCY_RATES[symbol] || 1;
      }
      this.cachedRates = rates;
      this.ratesTimestamp = Date.now();
      return rates;
    } catch (error) {
      console.error("Failed to fetch rates from CoinGecko:", error);
      return this.CURRENCY_RATES; // fallback to static rates
    }
  }

  /**
   * Approve a deposit and update user's wallet balance
   */
  static async approveDeposit(
    transactionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const transaction = this.getTransactionById(transactionId);
      if (!transaction || transaction.type !== "Deposit") {
        throw new Error("Invalid deposit transaction");
      }

      if (transaction.status !== "Processing") {
        throw new Error("Transaction is not in processing status");
      }

      // Calculate crypto amount using live rates
      const cryptoAmount = await this.convertUsdToCrypto(
        transaction.amount,
        transaction.coin || "USDT"
      );

      // Update transaction status
      const updatedTransaction = {
        ...transaction,
        status: "Approved" as const,
      };
      this.updateTransaction(updatedTransaction);

      // Update user balance
      const balanceUpdate: BalanceUpdate = {
        userId,
        currency: transaction.coin || "USDT",
        amount: cryptoAmount,
        transactionId,
      };

      this.updateUserBalance(balanceUpdate);

      // Emit balance update event with more details
      balanceUpdateEmitter.emit("balanceUpdate", {
        userId,
        currency: transaction.coin || "USDT",
        amount: cryptoAmount,
        transactionId,
        timestamp: Date.now(),
        type: "deposit",
        usdAmount: transaction.amount,
      });

      // Log the approval
      console.log(`Deposit ${transactionId} approved for user ${userId}`, {
        usdAmount: transaction.amount,
        cryptoAmount,
        currency: transaction.coin,
      });

      return true;
    } catch (error) {
      console.error("Error approving deposit:", error);
      return false;
    }
  }

  /**
   * Get transaction by ID
   */
  private static getTransactionById(id: string): Transaction | null {
    const transactions = this.getTransactions();
    return transactions.find((tx) => tx.id === id) || null;
  }

  /**
   * Get all transactions
   */
  private static getTransactions(): Transaction[] {
    try {
      return JSON.parse(
        localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS) || "[]"
      );
    } catch {
      return [];
    }
  }

  /**
   * Update transaction in storage
   */
  private static updateTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((tx) => tx.id === transaction.id);

    if (index >= 0) {
      transactions[index] = transaction;
    } else {
      transactions.unshift(transaction);
    }

    localStorage.setItem(
      this.STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }

  /**
   * Update user balance
   */
  private static updateUserBalance(update: BalanceUpdate): void {
    const balances = this.getUserBalances(update.userId);
    const currencyKey = this.normalizeCurrencyKey(update.currency);

    if (!balances[currencyKey]) {
      balances[currencyKey] = 0;
    }

    balances[currencyKey] += update.amount;

    localStorage.setItem(
      this.STORAGE_KEYS.USER_BALANCES(update.userId),
      JSON.stringify(balances)
    );
  }

  /**
   * Get user balances
   */
  private static getUserBalances(userId: string): { [key: string]: number } {
    try {
      return JSON.parse(
        localStorage.getItem(this.STORAGE_KEYS.USER_BALANCES(userId)) || "{}"
      );
    } catch {
      return {
        USDT: 100.0,
        ETH: 0.5,
        BTC: 0.01,
        SOL: 10.0,
      };
    }
  }

  /**
   * Convert USD amount to crypto amount using live rates
   */
  private static async convertUsdToCrypto(
    usdAmount: number,
    currency: string
  ): Promise<number> {
    const rates = await this.fetchCurrencyRates();
    const rate = rates[currency] || 1.0;
    return usdAmount / rate;
  }

  /**
   * Normalize currency key
   */
  private static normalizeCurrencyKey(currency: string): string {
    return currency === "USDT_TRC20" ? "USDT" : currency;
  }

  /**
   * Get transaction history for a user
   */
  static getUserTransactionHistory(userId: string): Transaction[] {
    return this.getTransactions().filter((tx) => tx.username === userId);
  }

  /**
   * Get current balance for a user
   */
  static getUserBalance(userId: string, currency: string): number {
    const balances = this.getUserBalances(userId);
    return balances[this.normalizeCurrencyKey(currency)] || 0;
  }

  /**
   * Validate transaction before approval
   */
  static validateTransaction(transaction: Transaction): string[] {
    const errors: string[] = [];

    if (transaction.type !== "Deposit") {
      errors.push("Transaction is not a deposit");
    }

    if (transaction.status !== "Processing") {
      errors.push("Transaction is not in processing status");
    }

    if (!transaction.coin) {
      errors.push("Transaction currency is missing");
    }

    if (transaction.amount <= 0) {
      errors.push("Invalid transaction amount");
    }

    return errors;
  }
}
