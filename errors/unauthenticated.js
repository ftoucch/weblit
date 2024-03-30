import { StatusCodes } from 'http-status-codes'

class UnAuthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnAuthenticatedError