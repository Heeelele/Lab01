import { test, expect, Page } from '@playwright/test';

// Нэвтрэх туслах функц
async function login(page: Page) {
  await page.goto('https://www.saucedemo.com');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products')).toBeVisible();
}

// Системээс гарах туслах функц
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();

  const logoutLink = page.locator('#logout_sidebar_link');

  await expect(logoutLink).toBeVisible();
  await logoutLink.click();

  // Нэвтрэх хуудас руу буцсан эсэхийг шалгах
  await expect(page.getByPlaceholder('Username')).toBeVisible();
}

// 1. Амжилттай нэвтрэх тест
test('амжилттай нэвтрэх', async ({ page }) => {
  await login(page);

  // Амжилттай нэвтэрсэн эсэхийг шалгах
  await expect(page).toHaveURL(/inventory.html/);

  // Системээс гарах
  await logout(page);
});

// 2. Буруу нууц үгээр нэвтрэх тест
test('буруу нууц үгээр нэвтрэх', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrong_password');

  await page.getByRole('button', { name: 'Login' }).click();

  // Алдааны мэдээлэл гарсан эсэхийг шалгах
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  // Нэвтрэх хуудсанд хэвээр байгаа эсэхийг шалгах
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});

// 3. Барааг сагсанд нэмэх тест
test('барааг сагсанд нэмэх', async ({ page }) => {
  await login(page);

  // Барааг сагсанд нэмэх
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Сагсанд нэг бараа байгаа эсэхийг шалгах
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Системээс гарах
  await logout(page);
});

// 4. Системээс гарах тест
test('системээс гарах', async ({ page }) => {
  await login(page);

  // Logout үйлдлийг шалгах
  await logout(page);
});
