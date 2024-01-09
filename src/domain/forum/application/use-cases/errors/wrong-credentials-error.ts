import { UseCaseError } from '@/core/errors/use-cases-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`Credentials are not valid`)
  }
}
