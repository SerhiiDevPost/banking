import db from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // getting id in query
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');
    
    // checking if id exists
    if (!id) return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    // fetching data from db
    const transactions = await db.transaction.findMany({
      where: {
        accountId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the transactions.' },
      { status: 500 }
    );
  }
}
