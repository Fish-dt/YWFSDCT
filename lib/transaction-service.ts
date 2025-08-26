// lib/transaction-service.ts
export interface Transaction {
  id: string;
  sender: any;
  receiver: any;
  amount: number;
  currency: string;
  cause: string;
  createdAt: string;
  type: "incoming" | "outgoing";
}

export interface TransactionSearchParams {
  page?: number;
  search?: string;
  sender?: string;
  receiver?: string;
  cause?: string;
  transactionId?: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function fetchUserTransactions(params: TransactionSearchParams = {}): Promise<TransactionResponse> {
  const p = params.page || 1; // use p
  const res = await fetch(`/api/transactions?p=${p}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown" }));
    throw new Error(err.error || `Failed to fetch transactions: ${res.status}`);
  }
  const data = await res.json();
  return transformApiResponse(data, p); // pass p as current page
}

export async function searchTransactions(params: TransactionSearchParams): Promise<TransactionResponse> {
  const p = params.page || 1; // use p
  const body: any = { page: p }; // the backend expects 'page'
  if (params.search) body.query = params.search;
  if (params.sender) body.sender = params.sender;
  if (params.receiver) body.receiver = params.receiver;
  if (params.cause) body.cause = params.cause;
  if (params.transactionId) body.transaction_id = params.transactionId;

  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown" }));
    throw new Error(err.error || `Failed to search transactions: ${res.status}`);
  }

  const data = await res.json();
  return transformApiResponse(data, p); // pass p as current page
}

function transformApiResponse(data: any, p: number): TransactionResponse {
  const transactions: Transaction[] = (data.data || []).map((item: any) => ({
    id: item.id || item.transaction_id || `txn_${Date.now()}_${Math.random()}`,
    sender: item.sender || item.sender_account || "Unknown",
    receiver: item.receiver || item.receiver_account || "Unknown",
    amount: Number.parseFloat(item.amount || "0"),
    currency: item.currency || "ETB",
    cause: item.cause || item.description || item.reason || "",
    createdAt: item.created_at || item.timestamp || item.date || new Date().toISOString(),
    type: determineTransactionType(item),
  }));

  const totalCount = typeof data.total === "number" ? data.total : transactions.length;
  const serverLimit = transactions.length; // actual items returned by API

  return {
    transactions,
    totalCount,
    currentPage: p, // use p here
    totalPages: Math.ceil(totalCount / serverLimit),
  };
}

function determineTransactionType(transaction: any): "incoming" | "outgoing" {
  const receiver = transaction.receiver?.account ?? transaction.receiver?.name;
  const sender = transaction.sender?.account ?? transaction.sender?.name;

  if (sender && receiver && sender === receiver) return "incoming";
  if (receiver === "current_user_wallet") return "incoming";
  return "outgoing";
}
