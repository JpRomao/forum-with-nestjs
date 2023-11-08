import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from 'src/auth/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt-strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  content: z.string(),
  title: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title } = body
    const slug = await this.slugify(title)

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: user.sub,
      },
    })

    return 'ok'
  }

  private async slugify(title: string) {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    const slugCount = await this.prisma.question.count({
      where: {
        slug,
      },
    })

    if (slugCount) {
      return `${slug}-${slugCount}`
    }

    return slug
  }
}
