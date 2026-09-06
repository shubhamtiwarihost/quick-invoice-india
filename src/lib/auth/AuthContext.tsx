"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { Lock, LogOut, ShieldAlert } from "lucide-react";

export interface AuthUser {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  storeType?: string;
  cashierPin?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isLocked: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  lockScreen: () => void;
  unlockWithPin: (pin: string) => boolean;
  verifyCashierPin: (pin: string) => boolean;
  updateUser: (data: Partial<AuthUser>) => void;
}

const TOKEN_KEY = "swiftgst_auth_token";
const USER_KEY = "swiftgst_auth_user";
const LOCKED_KEY = "swiftgst_auth_locked";
const COOKIE_NAME = "swiftgst_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  // 1. Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      const storedLocked = localStorage.getItem(LOCKED_KEY) === "true";

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setToken(storedToken);
        setUser(parsedUser);
        setIsLocked(storedLocked);

        // Verify session with server in background
        fetch("/api/auth.php?action=me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              if (data.status === "success" && data.user) {
                setUser(data.user);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
              }
            } else if (res.status === 401) {
              // Session expired or revoked
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              deleteCookie(COOKIE_NAME);
              setToken(null);
              setUser(null);
            }
          })
          .catch(() => {
            // Offline fallback: keep cached user so POS functions 100% offline
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      }
    } catch {
      // Storage parsing failed
    }
    setIsLoading(false);
  }, []);

  // 2. Login function
  const login = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    setIsLocked(false);

    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      localStorage.removeItem(LOCKED_KEY);
      setCookie(COOKIE_NAME, newToken, 30);

      // Sync store settings for POS receipts
      const existingSettings = localStorage.getItem("swiftpos_store_settings");
      if (existingSettings) {
        const parsed = JSON.parse(existingSettings);
        parsed.businessName = newUser.businessName;
        if (newUser.phone) parsed.phone = newUser.phone;
        localStorage.setItem("swiftpos_store_settings", JSON.stringify(parsed));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // 3. Logout function
  const logout = useCallback(async () => {
    const activeToken = token || localStorage.getItem(TOKEN_KEY);
    if (activeToken) {
      try {
        fetch("/api/auth.php?action=logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ token: activeToken }),
        }).catch(() => {});
      } catch {
        // Ignore network errors on logout
      }
    }

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LOCKED_KEY);
      deleteCookie(COOKIE_NAME);
    } catch {
      // Ignore storage errors
    }

    setToken(null);
    setUser(null);
    setIsLocked(false);
    router.push("/login");
  }, [token, router]);

  // 4. Cashier Lock screen functions
  const lockScreen = useCallback(() => {
    setIsLocked(true);
    try {
      localStorage.setItem(LOCKED_KEY, "true");
    } catch {
      // Ignore
    }
  }, []);

  const verifyCashierPin = useCallback(
    (pin: string): boolean => {
      const correctPin = user?.cashierPin || "1234";
      return pin.trim() === correctPin.trim();
    },
    [user]
  );

  const unlockWithPin = useCallback(
    (pin: string): boolean => {
      if (verifyCashierPin(pin)) {
        setIsLocked(false);
        try {
          localStorage.removeItem(LOCKED_KEY);
        } catch {
          // Ignore
        }
        return true;
      }
      return false;
    },
    [verifyCashierPin]
  );

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLocked,
        login,
        logout,
        lockScreen,
        unlockWithPin,
        verifyCashierPin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Loyverse-Style Cashier PIN Pad Unlock Screen
 */
export function CashierLockScreen() {
  const { user, unlockWithPin, logout } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        setError(false);

        if (nextPin.length === 4) {
          const success = unlockWithPin(nextPin);
          if (!success) {
            setError(true);
            setShake(true);
            setTimeout(() => {
              setPin("");
              setShake(false);
            }, 600);
          }
        }
      }
    },
    [pin, unlockWithPin]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  const handleClear = useCallback(() => {
    setPin("");
    setError(false);
  }, []);

  // Support physical keyboard / barcode scanner entry
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        handleClear();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, handleClear]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 text-center text-white shadow-2xl transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Store Icon & Header */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30">
          <Lock className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white">
          {user?.businessName || "Store POS"}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Logged in as <span className="font-semibold text-teal-400">{user?.ownerName || "Cashier"}</span>
        </p>

        <div className="mt-5 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Enter Cashier PIN
          </span>
          {/* 4-digit PIN circles */}
          <div className="mt-3 flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-full transition-all duration-150 ${
                    isFilled
                      ? error
                        ? "bg-rose-500 scale-110 shadow-rose-500/50 shadow-md"
                        : "bg-teal-400 scale-110 shadow-teal-400/50 shadow-md"
                      : "bg-slate-700 ring-1 ring-slate-600"
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <p className="mt-3 text-xs font-semibold text-rose-400 animate-in fade-in">
              Incorrect PIN. (Default: 1234)
            </p>
          )}
        </div>

        {/* Numpad */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-800/90 text-xl font-semibold text-white transition active:scale-95 active:bg-teal-600 hover:bg-slate-700/80 focus:outline-none"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400 transition active:scale-95 hover:bg-slate-800 hover:text-white"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="h-14 rounded-2xl bg-slate-800/90 text-xl font-semibold text-white transition active:scale-95 active:bg-teal-600 hover:bg-slate-700/80 focus:outline-none"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-800/40 text-sm font-semibold text-slate-400 transition active:scale-95 hover:bg-slate-800 hover:text-white"
            aria-label="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Hint: Default PIN is 1234</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Route protection wrapper for POS and business management screens
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isLocked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        <h3 className="mt-4 text-base font-bold text-slate-800">Verifying Store Session...</h3>
        <p className="mt-1 text-xs text-slate-500">Loading offline-ready retail workspace</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-teal-700 animate-pulse" />
        <h3 className="mt-4 text-base font-bold text-slate-800">Authentication Required</h3>
        <p className="mt-1 text-xs text-slate-500">Redirecting to store sign-in screen...</p>
      </div>
    );
  }

  return (
    <>
      {isLocked && <CashierLockScreen />}
      {children}
    </>
  );
}
