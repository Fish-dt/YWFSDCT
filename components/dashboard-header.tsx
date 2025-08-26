import Image from "next/image"
import Link from "next/link"
import { ExternalLink, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function DashboardHeader() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="https://yayawallet.com/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logo.png"
              alt="YaYa Wallet"
              width={120}
              height={40}
              className="h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>

          
        </div>

        <div className="flex items-center gap-4">
          <Link
              href="https://yayawallet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
