import { test, expect } from '@playwright/test';

test('NM-01 - Erro HTTP 500 e recuperação', async ({ page }) => {

  let calls = 0;

  // Interceptar a requisição
  await page.route('**/mock/products.json*', async (route) => {

    calls++;

    if (calls === 1) {
      await route.fulfill({
        status: 500,
        body: 'Internal Server Error'
      });
      return;
    }

    // Permitir a segunda requisição real
    await route.continue();
  });

  // Acessar a aplicação
  await page.goto(
    'https://www.practiceqaautomation.com/dynamic/network-mocking'
  );

  // Verificar a mensagem de erro
  await expect(
    page.getByTestId('net-app').getByRole('alert')
  ).toContainText('The server had a problem (500)');

  // Tentar novamente
  await page.getByRole('button', { name: 'Try again' }).click();

  // Validar a recuperação
  await expect(
    page.getByTestId('net-item')
  ).toHaveCount(8);

  // Confirmar que ocorreram duas requisições
  expect(calls).toBe(2);

});