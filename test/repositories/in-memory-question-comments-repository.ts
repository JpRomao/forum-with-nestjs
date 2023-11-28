import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../../src/domain/forum/application/repositories/question-comments-repository'
import { PaginationParams } from '../../src/core/repositories/pagination-params'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string) {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const itemsToShow = 20
    const start = (page - 1) * itemsToShow
    const end = page * itemsToShow

    const questionComments = this.items
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .slice(start, end)

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === questionComment.id.toString(),
    )

    this.items.splice(index, 1)
  }
}
