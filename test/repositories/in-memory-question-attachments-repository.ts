import { QuestionAttachmentsRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '../../src/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
