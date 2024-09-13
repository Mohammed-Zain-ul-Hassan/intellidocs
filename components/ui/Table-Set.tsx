import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from 'lucide-react'

const initialInvoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: 250.00,
    paymentMethod: "Credit Card",
    date: "2023-05-01",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: 150.00,
    paymentMethod: "PayPal",
    date: "2023-05-03",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: 350.00,
    paymentMethod: "Bank Transfer",
    date: "2023-05-02",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: 450.00,
    paymentMethod: "Credit Card",
    date: "2023-05-04",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: 550.00,
    paymentMethod: "PayPal",
    date: "2023-05-05",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: 200.00,
    paymentMethod: "Bank Transfer",
    date: "2023-05-06",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: 300.00,
    paymentMethod: "Credit Card",
    date: "2023-05-07",
  },
]

export function TableDemo() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [filter, setFilter] = useState('')

  const handleSort = (type: string) => {
    let sortedInvoices = [...invoices]
    switch(type) {
      case 'alphabetical':
        sortedInvoices.sort((a, b) => a.invoice.localeCompare(b.invoice))
        break
      case 'date':
        sortedInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'amount':
        sortedInvoices.sort((a, b) => b.totalAmount - a.totalAmount)
        break
    }
    setInvoices(sortedInvoices)
  }

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoice.toLowerCase().includes(filter.toLowerCase()) ||
    invoice.paymentStatus.toLowerCase().includes(filter.toLowerCase()) ||
    invoice.paymentMethod.toLowerCase().includes(filter.toLowerCase())
  )

  const total = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <Input 
          placeholder="Filter invoices..." 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('alphabetical')}>
              Alphabetically
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('date')}>
              By Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('amount')}>
              By Amount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell className="text-right">${invoice.totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">${total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}