import { expect, test } from '@playwright/test'

test.describe('ホームページ', () => {
  test('タイトルとメインコンテンツが表示される', async ({ page }) => {
    await page.goto('/')

    // タイトル
    await expect(page).toHaveTitle('New Remix App')

    // メインコンテンツ
    await expect(page.getByText('Welcome to')).toBeVisible()
    await expect(page.getByText("What's next?")).toBeVisible()

    // リンク
    const links = [
      { text: 'Quick Start (5 min)', href: 'https://remix.run/start/quickstart' },
      { text: 'Tutorial (30 min)', href: 'https://remix.run/start/tutorial' },
      { text: 'Remix Docs', href: 'https://remix.run/docs' },
      { text: 'Join Discord', href: 'https://rmx.as/discord' },
    ]

    for (const { text, href } of links) {
      const link = page.getByRole('link', { name: text })
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', href)
    }
  })

  test('ダークモードが機能する', async ({ page }) => {
    await page.goto('/')

    // デフォルトはライトモード
    const lightLogo = page.locator('img[alt="Remix"].block')
    const darkLogo = page.locator('img[alt="Remix"].dark\\:block')
    await expect(lightLogo).toBeVisible()
    await expect(darkLogo).toHaveClass(/hidden/)

    // ダークモードに切り替え
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.waitForTimeout(100) // CSSの切り替えを待つ
    await expect(lightLogo).toHaveClass(/dark:hidden/)
    await expect(darkLogo).toBeVisible()
  })
})
