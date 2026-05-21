export type TransferFormValues = {
  receiverEmail: string;
  amount: string;
};

export type TransferResponse = {
  message: string;
  transaction: {
    id: string;
    amount: string | number;
    type: string;
    status: string;
    walletId: string;
    createdAt: string;
    updatedAt: string;
  };
};
