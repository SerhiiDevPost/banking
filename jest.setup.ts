import '@testing-library/jest-dom'
import 'whatwg-fetch'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => data),
  },
}));


global.Request = jest.fn().mockImplementation((input, init) => ({
  url: input,
  ...init,
}))
