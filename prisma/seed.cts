import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 管理者ユーザーの作成
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理者',
      role: 'ADMIN',
    },
  })

  // テストユーザーの作成
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'テストユーザー',
      role: 'USER',
    },
  })

  console.log({ admin, user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
