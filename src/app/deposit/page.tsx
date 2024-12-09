'use server'
import { DepositForm } from "@/components/DepositForm/DepositForm";

export default async function DepositPage () {
  return (
    <div className="padding-page">
      <p>Deposit some money to make transaction</p>
      <DepositForm />
    </div>
  )
}