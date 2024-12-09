import { Transaction } from "@prisma/client"
import { cookies } from "next/headers"

async function fetchTransactions (id: string) {
  const transactions = await fetch(`${process.env.BASE_URL}api/transactions?id=${id}`, {next: { tags: ['balance'] }})
  return transactions.json()
}

export async function AccountHistory() {
  const cookieStore = await cookies()
  const id = cookieStore.get('id')
  const transactions: Transaction[] = await fetchTransactions(id?.value!)
  return (
    <div className="w-full">
      <h1>Transactions History</h1>
      <div className="flex justify-around">
        <p>Date</p>
        <p>Amount</p>
        <p>Balance</p>
      </div>
      <div className="flex flex-col">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex justify-around">
            <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
            <p>{transaction.type === 'deposit' ? '+' : '-'}{transaction.amount}</p>
            <p>{transaction.rest}</p>
          </div>
        ))}
      </div>
    </div>
  )
}