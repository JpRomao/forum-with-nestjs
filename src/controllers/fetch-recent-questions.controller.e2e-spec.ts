import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question title 1',
          content: 'Question content 1',
          slug: 'question-title-1',
          authorId: user.id,
        },
        {
          title: 'Question title 2',
          content: 'Question content 2',
          slug: 'question-title-2',
          authorId: user.id,
        },
        {
          title: 'Question title 3',
          content: 'Question content 3',
          slug: 'question-title-3',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer()).get('/questions').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(3)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question title 1' }),
        expect.objectContaining({ title: 'Question title 2' }),
        expect.objectContaining({ title: 'Question title 3' }),
      ],
    })
  })
})
