import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subDays } from 'date-fns';

export interface SparkTransactionItem {
  id: string;
  /** i18n key under `sparks.*` describing why the points changed */
  reasonKey: string;
  amount: number; // positive = earned, negative = spent
  timestamp: string; // ISO String
}

interface WalletState {
  points: number;
  transactions: SparkTransactionItem[];
  addPoints: (amount: number, reasonKey?: string) => void;
  /** Deducts `amount` points if the balance covers it. Returns false (no-op) otherwise. */
  spendPoints: (amount: number, reasonKey: string) => boolean;
}

function createTransaction(reasonKey: string, amount: number): SparkTransactionItem {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reasonKey,
    amount,
    timestamp: new Date().toISOString(),
  };
}

// Initial mock spark transactions — matches the seeded `points: 120`
const INITIAL_TRANSACTIONS: SparkTransactionItem[] = [
  {
    id: 'txn_welcome',
    reasonKey: 'sparks.txn_welcome',
    amount: 100,
    timestamp: subDays(new Date(), 3).toISOString(),
  },
  {
    id: 'txn_first_post',
    reasonKey: 'sparks.txn_post',
    amount: 20,
    timestamp: subDays(new Date(), 1).toISOString(),
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      points: 120,
      transactions: INITIAL_TRANSACTIONS,

      addPoints: (amount, reasonKey = 'sparks.txn_activity') =>
        set((state) => ({
          points: state.points + amount,
          transactions: [
            createTransaction(reasonKey, amount),
            ...state.transactions,
          ],
        })),

      spendPoints: (amount, reasonKey) => {
        if (get().points < amount) return false;
        set((state) => ({
          points: state.points - amount,
          transactions: [
            createTransaction(reasonKey, -amount),
            ...state.transactions,
          ],
        }));
        return true;
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
