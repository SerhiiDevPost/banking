
import { NextApiRequest } from 'next';
import db from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
  try {
    // getting id in query
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');
    
    // checking if id exists
    if (!id) return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    // fetching data from db
    const account = await db.account.findUnique({where: {id: id}})

    return NextResponse.json({balance: account?.balance})
  } catch (error) {
    console.error('Error processing balance:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the balance.' },
      { status: 500 }
    );
  }
}