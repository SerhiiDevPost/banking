import { AccountHistory } from "@/components/AccountHistory/AccountHistory"
import { TransferForm } from "@/components/TransferForm/TransferForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// fetching balance using "get-balance" endpoint
async function fetchBalance(accountId: string) {
  const balance = await fetch(`${process.env.BASE_URL}api/get-balance?id=${accountId}`, {next: { tags: ['balance'] }})
  return balance.json()
}

export default async function TransferPage () {
  const cookieStore = await cookies()
  // get account id from next cookie
  const accountId = cookieStore.get('id')
  //checking if id exists
  if(!accountId?.value) {
    redirect('/deposit')
  }
  const balance = await fetchBalance(accountId.value)
  return (
    <div className="padding-page">
      <div>
        <p>Balance - {balance.balance}</p>
      </div>
      <h1>Transfer Form</h1>
      <div className="flex gap-3 flex-col md:flex-row">
        <TransferForm id={accountId.value} />
        <AccountHistory />
      </div>
    </div>
  )
}