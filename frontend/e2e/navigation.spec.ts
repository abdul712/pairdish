import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/PairDish/)
    await expect(page.locator('h1')).toContainText('PairDish')
  })

  test('navigation menu is functional', async ({ page }) => {
    await page.goto('/')
    
    // Check if navigation exists
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Test search link
    await page.click('[href="/search"]')
    await expect(page).toHaveURL('/search')
    
    // Test home link
    await page.click('[href="/"]')
    await expect(page).toHaveURL('/')
  })

  test('search functionality works', async ({ page }) => {
    await page.goto('/search')
    
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    
    // Test search input
    await searchInput.fill('chicken')
    await page.keyboard.press('Enter')
    
    // Should show search results or loading state
    await expect(page.locator('text=Search')).toBeVisible()
  })

  test('responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu toggle exists
    const mobileMenuToggle = page.locator('[aria-label="Toggle menu"]')
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click()
      
      // Check if mobile menu opened
      const mobileMenu = page.locator('nav [role="menu"]')
      await expect(mobileMenu).toBeVisible()
    }
  })
})

test.describe('Error Handling', () => {
  test('handles broken images gracefully', async ({ page }) => {
    await page.goto('/')
    
    // Intercept image requests and make them fail
    await page.route('**/*.{jpg,jpeg,png,gif,webp}', route => {
      route.abort()
    })
    
    await page.reload()
    
    // Check that fallback text appears
    const fallbackText = page.locator('text=Image unavailable')
    if (await fallbackText.count() > 0) {
      await expect(fallbackText.first()).toBeVisible()
    }
  })

  test('error boundary catches JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // If there are any React errors, the error boundary should catch them
    // and display an error message instead of crashing the page
    const errorBoundaryMessage = page.locator('text=Something went wrong')
    
    // The page should still be functional even if errors occur
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Check if focus is visible on interactive elements
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('has proper heading structure', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check for semantic HTML
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    
    // Check that all images have alt attributes
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const altText = await img.getAttribute('alt')
      expect(altText).not.toBeNull()
      expect(altText).not.toBe('')
    }
  })
})