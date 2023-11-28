import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../../src/domain/forum/application/repositories/answer-comments-repository'
import { PaginationParams } from '../../src/core/repositories/pagination-params'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answerComment = this.items.find(
      (answerComment) => answerComment.id.toString() === id,
    )

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const itemsToShow = 20
    const start = (page - 1) * itemsToShow
    const end = page * itemsToShow

    const answerComments = this.items
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice(start, end)

    return answerComments
  }

  async create(answercomment: AnswerComment) {
    this.items.push(answercomment)
  }

  async delete(answercomment: AnswerComment) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answercomment.id.toString(),
    )

    this.items.splice(index, 1)
  }
}
