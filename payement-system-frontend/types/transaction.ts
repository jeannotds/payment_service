export type Wallet = {
  id: string;
  balance: string | number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  amount: string | number;
  type: string;
  status: string;
  walletId: string;
  reference?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionListItem = Transaction & {
  wallet?: {
    id: string;
    userId: string;
    balance: string | number;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

export type TransactionsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TransactionsListResponse = {
  transactions: TransactionListItem[];
  meta: TransactionsMeta;
};

/** Réponse deposit / withdraw (même forme côté backend) */
export type TransactionMutationResponse = {
  wallet: Wallet;
  transaction: Transaction;
};
