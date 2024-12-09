
export function generateAccountNumber(length: number = 10): string {
  let accountNumber = '';
  for (let i = 0; i < length; i++) {
    accountNumber += Math.floor(Math.random() * 10); // Adding random digit
  }
  return accountNumber;
}