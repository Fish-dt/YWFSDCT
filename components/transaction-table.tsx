"use client";

import { Fragment, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { TransactionSearch } from "./transaction-search";
import { Pagination } from "./pagination";
import {
  fetchUserTransactions,
  searchTransactions,
  type Transaction,
  type TransactionSearchParams,
} from "@/lib/transaction-service";


export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadTransactions = async (params: TransactionSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const opts = { ...params };
      const response = opts.search
        ? await searchTransactions(opts)
        : await fetchUserTransactions(opts);

      setTransactions(response.transactions || []);
      setTotalCount(response.totalCount);
      const pageSize = 15;
      setTotalPages(Math.max(1, Math.ceil(response.totalCount / pageSize)));

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    const id = setTimeout(() => {
      setCurrentPage(1);
      if (searchQuery.trim()) {
        loadTransactions({ page: 1, search: searchQuery.trim() });
      } else {
        loadTransactions({ page: 1 });
      }
    }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handlePageChange = (p: number) => {
  if (p < 1 || p > totalPages) return;
  setCurrentPage(p);

  if (searchQuery.trim()) {
    loadTransactions({ page: p, search: searchQuery.trim() }); // p is used here
  } else {
    loadTransactions({ page: p }); // p is used here
  }
};



  const formatAmount = (amount: number, currency = "ETB") =>
    new Intl.NumberFormat("en-ET", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const iconFor = (type: string) =>
    type === "incoming" ? (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
        <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
      </div>
    ) : (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30">
        <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
      </div>
    );

  const badgeFor = (type: string) =>
    type === "incoming" ? (
      <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium">
        <TrendingUp className="h-3 w-3 mr-1" /> Incoming
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium">
        <TrendingDown className="h-3 w-3 mr-1" /> Outgoing
      </Badge>
    );

  const rowStyle = (type: string) =>
    type === "incoming"
      ? "hover:bg-green-50/50 dark:hover:bg-green-900/20 border-l-4 border-l-green-500 bg-green-50/20 dark:bg-green-900/10"
      : "hover:bg-red-50/50 dark:hover:bg-red-900/20 border-l-4 border-l-red-500 bg-red-50/20 dark:bg-red-900/10";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-4">
          <TransactionSearch onSearch={handleSearch} />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : (
              `${totalCount} transaction${totalCount !== 1 ? "s" : ""} found`
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
          <div className="text-red-700 dark:text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
          <Button variant="outline" size="sm" onClick={() => loadTransactions({ page: currentPage })} className="mt-2 rounded-lg">
            Try Again
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="hidden md:table-header-group">
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead>Type</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading transactions...
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <Fragment key={tx.id}>
                  {/* desktop row */}
                  <TableRow className={`hidden md:table-row ${rowStyle(tx.type)}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {iconFor(tx.type)}
                        {badgeFor(tx.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-300">{tx.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{(tx.sender as any)?.name ?? String((tx.sender as any) ?? "Unknown")}</span>
                        {((tx.sender as any)?.name ?? tx.sender) === "current_user_wallet" && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-md">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{(tx.receiver as any)?.name ?? String((tx.receiver as any) ?? "Unknown")}</span>
                        {((tx.receiver as any)?.name ?? tx.receiver) === "current_user_wallet" && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-md">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${tx.type === "incoming" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "incoming" ? "+" : "-"}
                          {formatAmount(tx.amount, tx.currency)}
                        </span>
                        {((tx.sender as any)?.name ?? tx.sender) === ((tx.receiver as any)?.name ?? tx.receiver) && (
                          <Badge variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-900/30 rounded-md">
                            Top-up
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 max-w-xs truncate">{tx.cause}</TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(tx.createdAt)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* mobile row */}
                  <TableRow className="md:hidden" key={`${tx.id}-mobile`}>
                    <TableCell colSpan={8} className="p-0">
                      <div className={`p-4 border-l-4 ${tx.type === "incoming" ? "border-l-green-500 bg-green-50/20" : "border-l-red-500 bg-red-50/20"}`}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">{iconFor(tx.type)}{badgeFor(tx.type)}</div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">TRANSACTION_ID</span>
                              <div className="font-mono text-gray-900 dark:text-gray-100 break-all">{tx.id}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">AMOUNT</span>
                              <div className={`font-bold text-lg ${tx.type === "incoming" ? "text-green-600" : "text-red-600"}`}>
                                {tx.type === "incoming" ? "+" : "-"}
                                {formatAmount(tx.amount, tx.currency)}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">SENDER</span>
                              <div className="font-medium text-gray-900 dark:text-gray-100 break-all">{(tx.sender as any)?.name ?? tx.sender}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">RECEIVER</span>
                              <div className="font-medium text-gray-900 dark:text-gray-100 break-all">{(tx.receiver as any)?.name ?? tx.receiver}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">CAUSE</span>
                              <div className="text-gray-900 dark:text-gray-100">{tx.cause}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">DATE</span>
                              <div className="text-gray-900 dark:text-gray-100">{formatDate(tx.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {searchQuery ? "No transactions found matching your search." : "No transactions available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalCount > 0 && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
