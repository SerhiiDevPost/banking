import { POST } from '../src/app/api/transfer/route';
import db from '../src/lib/prisma';
import { NextResponse } from 'next/server';

jest.mock('../src/lib/prisma', () => ({
  account: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe('POST /api/transfer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a message if the user does not exist', async () => {
    (db.account.findUnique as jest.Mock).mockResolvedValue(null);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        amount: 100,
        to: 'receiverId',
        type: 'transfer',
        accountId: 'nonExistentId',
      }),
    } as unknown as Request;

    const response = await POST(mockRequest);

    expect(response).toEqual(NextResponse.json({ message: 'User does not exist' }));
    expect(db.account.findUnique).toHaveBeenCalledWith({ where: { id: 'nonExistentId' } });
  });

  // it('should return a message if the user does not have enough balance', async () => {
  //   (db.account.findUnique as jest.Mock).mockResolvedValue({
  //     id: 'existingId',
  //     balance: 50,
  //   });

  //   const mockRequest = {
  //     json: jest.fn().mockResolvedValue({
  //       amount: 100,
  //       to: 'receiverId',
  //       type: 'transfer',
  //       accountId: 'existingId',
  //     }),
  //   } as unknown as Request;

  //   const response = await POST(mockRequest);

  //   expect(response).toEqual(
  //     NextResponse.json(
  //       { message: "You don`t have enough money to transfer" },
  //       { status: 400 }
  //     )
  //   );
  //   expect(db.account.findUnique).toHaveBeenCalledWith({ where: { id: 'existingId' } });
  // });

  // it('should process the transaction successfully', async () => {
  //   (db.account.findUnique as jest.Mock).mockResolvedValue({
  //     id: 'existingId',
  //     balance: 200,
  //   });

  //   (db.$transaction as jest.Mock).mockResolvedValue([
  //     { id: 'existingId', balance: 100 },
  //     { id: 'transactionId', amount: 100 },
  //   ]);

  //   const mockRequest = {
  //     json: jest.fn().mockResolvedValue({
  //       amount: 100,
  //       to: 'receiverId',
  //       type: 'transfer',
  //       accountId: 'existingId',
  //     }),
  //   } as unknown as Request;

  //   const response = await POST(mockRequest);

  //   expect(response).toEqual(
  //     NextResponse.json(
  //       { message: 'Transaction successfully passed. Your balance 100' },
  //       { status: 201 }
  //     )
  //   );
  //   expect(db.account.findUnique).toHaveBeenCalledWith({ where: { id: 'existingId' } });
  //   expect(db.$transaction).toHaveBeenCalledWith([
  //     expect.objectContaining({
  //       where: { id: 'existingId' },
  //       data: { balance: 100 },
  //     }),
  //     expect.objectContaining({
  //       data: {
  //         type: 'transfer',
  //         to: 'receiverId',
  //         rest: 100,
  //         amount: 100,
  //         accountId: 'existingId',
  //       },
  //     }),
  //   ]);
  // });

  // it('should return an error message if an exception occurs', async () => {
  //   (db.account.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

  //   const mockRequest = {
  //     json: jest.fn().mockResolvedValue({
  //       amount: 100,
  //       to: 'receiverId',
  //       type: 'transfer',
  //       accountId: 'existingId',
  //     }),
  //   } as unknown as Request;

  //   const response = await POST(mockRequest);

  //   expect(response).toEqual(
  //     NextResponse.json(
  //       { message: 'An error occurred while processing the transaction.' },
  //       { status: 500 }
  //     )
  //   );
  //   expect(db.account.findUnique).toHaveBeenCalledWith({ where: { id: 'existingId' } });
  // });
});
