// Withdrawal Approval Service
// Handles withdrawal approval and wallet balance deduction

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal";
  status: "Processing" | "Approved" | "Failed";
  date: string;
  amount: number;
  username?: string;
  coin?: string;
  walletAddress?: string;
}

interface BalanceUpdate {
  userId: string;
  currency: string;
  amount: number;
  transactionId: string;
}

export class WithdrawalApprovalService {
  private static readonly STORAGE_KEYS = {
    TRANSACTIONS: "transactions",
    USER_BALANCES: (userId: string) => `userBalances_${userId}`,
  };

  /**
   * Get current cryptocurrency prices in USD
   */
  private static async getCurrentPrices(): Promise<{ [key: string]: number }> {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd"
      );
      const data = await response.json();

      return {
        USDT: data.tether.usd,
        ETH: data.ethereum.usd,
        BTC: data.bitcoin.usd,
        SOL: data.solana.usd,
      };
    } catch (error) {
      console.error("Error fetching prices:", error);
      // Fallback prices
      return {
        USDT: 1.0,
        ETH: 3000.0,
        SOL: 150.0,
        BTC: 120000.0,
      };
    }
  }

  /**
   * Approve a withdrawal and deduct from user's wallet balance
   */
  static async approveWithdrawal(
    transactionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const transaction = this.getTransactionById(transactionId);
      if (!transaction || transaction.type !== "Withdrawal") {
        throw new Error("Invalid withdrawal transaction");
      }

      if (transaction.status !== "Processing") {
        throw new Error("Transaction is not in processing status");
      }

      // Check if withdrawal amount is less than user's available balance
      const withdrawalAmount = transaction.amount;
      const userCryptoBalance = this.getUserBalance(
        userId,
        transaction.coin || "USDT"
      );

      // Get current price for the coin to convert crypto balance to USD
      const prices = await this.getCurrentPrices();
      const coinPrice = prices[transaction.coin || "USDT"] || 1;
      const userBalanceInUSD = userCryptoBalance * coinPrice;

      // Approve transaction if withdrawal amount is less than user's USD equivalent balance
      if (withdrawalAmount > userBalanceInUSD) {
        throw new Error(
          `Insufficient balance. Available: ${userCryptoBalance} ${
            transaction.coin
          } (~$${userBalanceInUSD.toFixed(2)} USD)`
        );
      }

      // Convert USD withdrawal amount to crypto amount for deduction
      const cryptoAmountToDeduct = withdrawalAmount / coinPrice;

      // Update transaction status
      const updatedTransaction = {
        ...transaction,
        status: "Approved" as const,
      };
      this.updateTransaction(updatedTransaction);

      // Deduct crypto amount from user balance
      const balanceUpdate: BalanceUpdate = {
        userId,
        currency: transaction.coin || "USDT",
        amount: cryptoAmountToDeduct, // Deduct the crypto equivalent amount
        transactionId,
      };

      this.deductUserBalance(balanceUpdate);

      console.log(`Withdrawal ${transactionId} approved for user ${userId}`, {
        usdAmount: transaction.amount,
        cryptoAmount: cryptoAmountToDeduct,
        currency: transaction.coin,
      });

      return true;
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      return false;
    }
  }

  /**
   * Decline a withdrawal
   */
  static async declineWithdrawal(transactionId: string): Promise<boolean> {
    try {
      const transaction = this.getTransactionById(transactionId);
      if (!transaction || transaction.type !== "Withdrawal") {
        throw new Error("Invalid withdrawal transaction");
      }

      const updatedTransaction = {
        ...transaction,
        status: "Failed" as const,
      };
      this.updateTransaction(updatedTransaction);

      return true;
    } catch (error) {
      console.error("Error declining withdrawal:", error);
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
   * Deduct from user balance
   */
  private static deductUserBalance(update: BalanceUpdate): void {
    const balances = this.getUserBalances(update.userId);
    const currencyKey = this.normalizeCurrencyKey(update.currency);

    if (!balances[currencyKey]) {
      balances[currencyKey] = 0;
    }

    balances[currencyKey] = Math.max(0, balances[currencyKey] - update.amount);

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
        USDT: 0,
        ETH: 0,
        BTC: 0,
        SOL: 0,
      };
    }
  }

  /**
   * Get current balance for a user
   */
  private static getUserBalance(userId: string, currency: string): number {
    const balances = this.getUserBalances(userId);
    return balances[this.normalizeCurrencyKey(currency)] || 0;
  }

  /**
   * Normalize currency key
   */
  private static normalizeCurrencyKey(currency: string): string {
    return currency === "USDT_TRC20" ? "USDT" : currency;
  }

  /**
   * Validate withdrawal before approval
   */
  static validateWithdrawal(transaction: Transaction): string[] {
    const errors: string[] = [];

    if (transaction.type !== "Withdrawal") {
      errors.push("Transaction is not a withdrawal");
    }

    if (transaction.status !== "Processing") {
      errors.push("Transaction is not in processing status");
    }

    if (!transaction.coin) {
      errors.push("Transaction currency is missing");
    }

    if (transaction.amount <= 0) {
      errors.push("Invalid withdrawal amount");
    }

    return errors;
  }
}
