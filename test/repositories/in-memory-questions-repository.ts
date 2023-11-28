import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachmentsRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find(
      (question) => question.id.toString() === id,
    )

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: { page: number }) {
    this.items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const itemsToShow = 20
    const start = (page - 1) * itemsToShow
    const end = page * itemsToShow

    return this.items.slice(start, end)
  }

  async create(question: Question) {
    this.items.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const index = this.items.findIndex(
      (item) => item.slug.value === question.slug.value,
    )

    this.items[index] = question

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const index = this.items.findIndex(
      (item) => item.slug.value === question.slug.value,
    )

    this.items.splice(index, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
