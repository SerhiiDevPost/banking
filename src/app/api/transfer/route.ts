import db from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { bodyTransferSchema } from '@/lib/transferSchema';

export async function POST(req: Request) {
  try {
    // get body's values
    const body = await req.json();
    const { amount, to, type, accountId } = bodyTransferSchema.parse(body);
    // find user in db
    const existingUser = await db.account.findUnique({
      where: {id: accountId}
    })
    // checking if user exists
    if(!existingUser) {
      return NextResponse.json({message: 'User does not exist'}) 
    }
    // checking balance
    if(existingUser.balance < amount) {
      return NextResponse.json({message: 'You don`t have enough money to tranfer'}, {status: 400})
    }

    const rest = existingUser.balance - amount
    const [updatedAccount] = await db.$transaction([
      // updatin balance
      db.account.update({
        where: { id: accountId },
        data: { balance: rest },
      }),
      // creating transaction
      db.transaction.create({
        data: {
          type: type,
          to: to,
          rest: rest,
          amount: amount,
          accountId: accountId,
        },
      }),
    ]);

    return NextResponse.json({message: `Transaction successfully passed. Your balance ${updatedAccount.balance}`}, {status: 201});
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the transaction.' },
      { status: 500 }
    );
  }
}
