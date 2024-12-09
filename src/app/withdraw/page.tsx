import { AccountHistory } from "@/components/AccountHistory/AccountHistory";
import { WithdrawForm } from "@/components/WithdrawForm/WithdrawForm";
import { cookies } from "next/headers";

async function fetchBalance(accountId: string) {
  const balance = await fetch(`${process.env.BASE_URL}api/get-balance?id=${accountId}`, {next: { tags: ['balance'] }})
  return balance.json()
}

export default async function WithdrawPage () {
  const cookieStore = await cookies()
  // get account id from next cookie
  const accountId = cookieStore.get('id')
  const balance = await fetchBalance(accountId?.value!)
  return (
    <div className="padding-page">
      <div>
        <p>Balance - {balance.balance}</p>
      </div>
      <h1>Withdraw Form</h1>
      <div className="flex gap-3 flex-col md:flex-row">
        <WithdrawForm />
        <AccountHistory />
      </div>
    </div>
  )
}