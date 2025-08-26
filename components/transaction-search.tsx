"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState } from "react"

interface TransactionSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function TransactionSearch({
  onSearch,
  placeholder = "Search by ID, sender, receiver, or cause...",
}: TransactionSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10 rounded-xl border-gray-200"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
