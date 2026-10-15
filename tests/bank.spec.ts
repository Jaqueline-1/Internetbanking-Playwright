import { test, expect, type Page } from '@playwright/test';

// Laboratório público de testes: dados demonstrativos, não credenciais reais.
const BASE_URL = 'https://www.practiceqaautomation.com';
const CUSTOMER_ID = '100200300';
const PASSWORD = 'Bank@123';
const SECURITY_ANSWER = 'greenwood';
const OTP = '246810';

// A função reaproveita o passo de preenchimento das credenciais.
async function preencherCredenciais(page: Page, senha = PASSWORD) {
  await page.getByLabel('Customer ID').fill(CUSTOMER_ID);
  await page.locator('#bank-password').fill(senha);
  await page.getByRole('button', { name: 'Continue' }).click();
}

// Reaproveita o login em cenários que exigem usuário autenticado.
async function entrarNoBanco(page: Page) {
  await page.goto(`${BASE_URL}/apps/bank`);
  await preencherCredenciais(page);
  await expect(page.getByTestId('security-question')).toBeVisible();
  await page.getByLabel('Your answer').fill(SECURITY_ANSWER);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/apps\/bank\/dashboard/);
  await expect(page.getByTestId('customer-name')).toContainText('Amir Khan');
}

// Percorre o fluxo completo até a tela de OTP.
async function prepararTransferencia(page: Page) {
  await entrarNoBanco(page);
  await page.getByTestId('action-transfer').click();
  await expect(page).toHaveURL(/\/apps\/bank\/transfer/);
  await page.getByRole('combobox', { name: 'From account' }).selectOption('savings');

  await page.getByTestId('add-payee').click();
  await page.locator('#payee-name').fill('Ravi Kumar');
  await page.getByLabel('Account number', { exact: true }).fill('123456789012');
  // Digitar normalmente: o formulário bloqueia colar neste campo.
  await page.locator('#payee-confirm-account').fill('123456789012');
  await page.getByLabel('IFSC code').fill('TRST0001234');
  await page.getByRole('button', { name: 'Save payee' }).click();

  await page.locator('#amount').fill('2500');
  await page.getByTestId('mode-imps').click();
  await page.getByLabel('Remarks (optional)').fill('Rent');
  await page.getByRole('button', { name: 'Review transfer' }).click();
  await expect(page.getByTestId('review-payee')).toContainText('Ravi Kumar');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#otp-input')).toBeVisible();
}

test.describe('TrustBank | Testes funcionais e E2E', () => {
  test('CT-001 | Autenticação em duas etapas com sucesso', async ({ page }) => {
    await entrarNoBanco(page);
    await expect(page.getByTestId('customer-name')).toBeVisible();
  });

  test('CT-002 | Senha incorreta apresenta erro', async ({ page }) => {
    await page.goto(`${BASE_URL}/apps/bank`);
    await preencherCredenciais(page, 'SenhaIncorreta@123');

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('security-question')).toBeHidden();
  });

  test('CT-003 | Conta é bloqueada após três senhas incorretas', async ({ page }) => {
    await page.goto(`${BASE_URL}/apps/bank`);

    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      await preencherCredenciais(page, 'SenhaIncorreta@123');
      if (tentativa < 3) {
        await expect(page.getByTestId('login-error')).toBeVisible();
      }
    }

    await expect(page.getByTestId('reset-lock')).toBeVisible();
  });

  test('CT-004 | Resposta de segurança incorreta não autentica', async ({ page }) => {
    await page.goto(`${BASE_URL}/apps/bank`);
    await preencherCredenciais(page);
    await expect(page.getByTestId('security-question')).toBeVisible();
    await page.getByLabel('Your answer').fill('resposta-errada');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByTestId('security-question')).toBeVisible();
    await expect(page).not.toHaveURL(/\/apps\/bank\/dashboard/);
  });

  test('CT-005 | Dashboard exige autenticação', async ({ page }) => {
    await page.goto(`${BASE_URL}/apps/bank/dashboard`);

    await expect(page.getByLabel('Customer ID')).toBeVisible();
    await expect(page).not.toHaveURL(/\/apps\/bank\/dashboard/);
  });

  test('CT-006 | Transferência com OTP é concluída', async ({ page }) => {
    await prepararTransferencia(page);
    await page.locator('#otp-input').fill(OTP);
    await page.getByRole('button', { name: 'Verify & transfer' }).click();

    await expect(page.getByTestId('transfer-success')).toBeVisible();
    await expect(page.getByTestId('transfer-amount')).toContainText('2,500.00');
    await expect(page.getByTestId('new-balance')).toContainText('1,22,930.50');
  });

  test('CT-007 | OTP incorreto impede a transferência', async ({ page }) => {
    await prepararTransferencia(page);
    await page.locator('#otp-input').fill('000000');
    await page.getByRole('button', { name: 'Verify & transfer' }).click();

    await expect(page.getByTestId('otp-error')).toBeVisible();
    await expect(page.getByTestId('transfer-success')).toBeHidden();
  });
});

test('CT-008 | API rejeita transferência acima do limite diário', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/bank/transfer-check`, {
    data: { from: 'savings', amount: 60000, mode: 'imps' },
  });

  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.errors.amount).toBe('Daily transfer limit is ₹50,000');
});
