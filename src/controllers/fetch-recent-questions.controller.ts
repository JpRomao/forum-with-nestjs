import { Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'

import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const take = 10
    const skip = (page - 1) * take

    const questions = await this.prisma.question.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
