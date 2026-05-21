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

/** Réponse deposit / withdraw (même forme côté backend) */
export type TransactionMutationResponse = {
  wallet: Wallet;
  transaction: Transaction;
};
