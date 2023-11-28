import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<null, { asnwers: Answer[] }>

export class FetchQuestionAnswersUseCase {
  constructor(private repository: AnswerRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const asnwers = await this.repository.findManyByQuestionId(questionId, {
      page,
    })

    return right({
      asnwers,
    })
  }
}
