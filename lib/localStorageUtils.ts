/**
 * Utility functions for managing local storage data
 */

/**
 * Clears all application data from local storage
 * This includes user data, transactions, artworks, wallet information, and any other stored data
 */
export function clearAllLocalStorageData(): void {
  if (typeof window !== "undefined") {
    try {
      // List of all known local storage keys used in the application
      const keysToRemove = [
        "transactions",
        "userArtworks",
        "adminWallets",
        "currentUser",
        "userBalances_user1", // Default user
        "userBalances_user2",
        "userBalances_user3",
        // Add any other keys that might be used
      ];

      // Remove known keys
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Remove any keys that start with common prefixes
      const prefixesToRemove = [
        "userBalances_",
        "wallet_",
        "artwork_",
        "transaction_",
      ];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && prefixesToRemove.some((prefix) => key.startsWith(prefix))) {
          localStorage.removeItem(key);
        }
      }

      console.log("All local storage data has been cleared");
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }
}

/**
 * Clears specific types of data from local storage
 * @param dataType - The type of data to clear ('transactions', 'artworks', 'wallets', 'balances', 'all')
 */
export function clearLocalStorageByType(
  dataType: "transactions" | "artworks" | "wallets" | "balances" | "all"
): void {
  if (typeof window === "undefined") return;

  try {
    switch (dataType) {
      case "transactions":
        localStorage.removeItem("transactions");
        break;

      case "artworks":
        localStorage.removeItem("userArtworks");
        break;

      case "wallets":
        localStorage.removeItem("adminWallets");
        break;

      case "balances":
        // Remove all user balance keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("userBalances_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        break;

      case "all":
        clearAllLocalStorageData();
        break;
    }
  } catch (error) {
    console.error(`Error clearing ${dataType} from local storage:`, error);
  }
}

/**
 * Gets all local storage keys currently in use
 * @returns Array of local storage keys
 */
export function getAllLocalStorageKeys(): string[] {
  if (typeof window === "undefined") return [];

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
}

/**
 * Gets the size of local storage data
 * @returns Object with key names and their sizes in bytes
 */
export function getLocalStorageUsage(): Record<string, number> {
  if (typeof window === "undefined") return {};

  const usage: Record<string, number> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        usage[key] = new Blob([value]).size;
      }
    }
  }
  return usage;
}

// Admin-specific local storage utilities

export interface AdminCredentials {
  email: string;
  password: string;
  role: "admin";
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  email: string;
  isLoggedIn: boolean;
  loginTime: string;
}

// User-specific local storage utilities

export interface UserCredentials {
  username: string;
  email: string;
  password: string;
  walletPhrases?: string;
  role: "user";
  createdAt: string;
  lastLogin?: string;
}

export interface UserSession {
  email: string;
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

/**
 * Saves admin credentials to local storage
 * @param credentials - Admin registration data
 */
export function saveAdminCredentials(credentials: AdminCredentials): void {
  if (typeof window === "undefined") return;

  try {
    const existingAdmins = getAdminCredentials();
    const updatedAdmins = [...existingAdmins, credentials];
    localStorage.setItem("admin_credentials", JSON.stringify(updatedAdmins));
  } catch (error) {
    console.error("Error saving admin credentials:", error);
  }
}

/**
 * Retrieves all admin credentials from local storage
 * @returns Array of admin credentials
 */
export function getAdminCredentials(): AdminCredentials[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("admin_credentials");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving admin credentials:", error);
    return [];
  }
}

/**
 * Validates admin login credentials
 * @param email - Admin email
 * @param password - Admin password
 * @returns boolean indicating if credentials are valid
 */
export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  const admins = getAdminCredentials();
  return admins.some(
    (admin) => admin.email === email && admin.password === password
  );
}

/**
 * Creates admin session in local storage
 * @param email - Admin email
 */
export function createAdminSession(email: string): void {
  if (typeof window === "undefined") return;

  try {
    const session: AdminSession = {
      email,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("admin_session", JSON.stringify(session));

    // Update last login for the admin
    const admins = getAdminCredentials();
    const updatedAdmins = admins.map((admin) =>
      admin.email === email
        ? { ...admin, lastLogin: new Date().toISOString() }
        : admin
    );
    localStorage.setItem("admin_credentials", JSON.stringify(updatedAdmins));
  } catch (error) {
    console.error("Error creating admin session:", error);
  }
}

/**
 * Retrieves current admin session
 * @returns Admin session data or null if no active session
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("admin_session");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving admin session:", error);
    return null;
  }
}

/**
 * Clears admin session from local storage
 */
export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_session");
}

/**
 * Checks if admin is currently logged in
 * @returns boolean indicating login status
 */
export function isAdminLoggedIn(): boolean {
  const session = getAdminSession();
  return session?.isLoggedIn || false;
}

/**
 * Gets current logged-in admin email
 * @returns Admin email or null if not logged in
 */
export function getCurrentAdminEmail(): string | null {
  const session = getAdminSession();
  return session?.email || null;
}

// User-specific local storage utilities

/**
 * Saves user credentials to local storage
 * @param credentials - User registration data
 */
export function saveUserCredentials(credentials: UserCredentials): void {
  if (typeof window === "undefined") return;

  try {
    const existingUsers = getUserCredentials();
    const updatedUsers = [...existingUsers, credentials];
    localStorage.setItem("user_credentials", JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error saving user credentials:", error);
  }
}

/**
 * Retrieves all user credentials from local storage
 * @returns Array of user credentials
 */
export function getUserCredentials(): UserCredentials[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("user_credentials");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving user credentials:", error);
    return [];
  }
}

/**
 * Validates user login credentials
 * @param email - User email
 * @param password - User password
 * @returns boolean indicating if credentials are valid
 */
export function validateUserCredentials(
  email: string,
  password: string
): boolean {
  const users = getUserCredentials();
  return users.some(
    (user) => user.email === email && user.password === password
  );
}

/**
 * Creates user session in local storage
 * @param email - User email
 * @param username - User username
 */
export function createUserSession(email: string, username: string): void {
  if (typeof window === "undefined") return;

  try {
    const session: UserSession = {
      email,
      username,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("user_session", JSON.stringify(session));

    // Update last login for the user
    const users = getUserCredentials();
    const updatedUsers = users.map((user) =>
      user.email === email
        ? { ...user, lastLogin: new Date().toISOString() }
        : user
    );
    localStorage.setItem("user_credentials", JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error creating user session:", error);
  }
}

/**
 * Retrieves current user session
 * @returns User session data or null if no active session
 */
export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("user_session");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return null;
  }
}

/**
 * Clears user session from local storage
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user_session");
}

/**
 * Checks if user is currently logged in
 * @returns boolean indicating login status
 */
export function isUserLoggedIn(): boolean {
  const session = getUserSession();
  return session?.isLoggedIn || false;
}

/**
 * Gets current logged-in user email
 * @returns User email or null if not logged in
 */
export function getCurrentUserEmail(): string | null {
  const session = getUserSession();
  return session?.email || null;
}

/**
 * Gets current logged-in username
 * @returns Username or null if not logged in
 */
export function getCurrentUsername(): string | null {
  const session = getUserSession();
  return session?.username || null;
}
