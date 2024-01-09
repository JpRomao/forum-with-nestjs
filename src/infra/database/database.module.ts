import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
  ],
  exports: [
    QuestionRepository,
    StudentsRepository,
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerRepository,
    PrismaQuestionCommentsRepository,
  ],
})
export class DatabaseModule {}
