"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { TransactionTable } from "@/components/transaction-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <Card className="rounded-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TransactionTable/>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
