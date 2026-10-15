import { test, expect, type Page } from '@playwright/test';

// Dados demonstrativos publicados pelo laboratório TrustBank.
const BANK_URL = 'https://www.practiceqaautomation.com/apps/bank';
const CUSTOMER_ID = '100200300';
const PASSWORD = 'Bank@123';
const SECURITY_ANSWER = 'greenwood';
const VALID_OTP = '246810';
const PAYEE = {
  name: 'Ravi Kumar',
  account: '123456789012',
  ifsc: 'TRST0001234',
} as const;

async function fazerLogin(page: Page): Promise<void> {
  await test.step('Autenticar cliente em duas etapas', async () => {
    await page.goto(BANK_URL);
    await page.getByLabel('Customer ID').fill(CUSTOMER_ID);
    await page.locator('#bank-password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByTestId('security-question')).toBeVisible();
    await page.getByLabel('Your answer').fill(SECURITY_ANSWER);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/apps\/bank\/dashboard/);
    await expect(page.getByTestId('customer-name')).toContainText('Amir Khan');
  });
}

async function prepararTransferencia(page: Page): Promise<void> {
  await fazerLogin(page);

  await test.step('Cadastrar beneficiário e informar transferência', async () => {
    await page.getByTestId('action-transfer').click();
    await expect(page).toHaveURL(/\/apps\/bank\/transfer/);
    await page.getByRole('combobox', { name: 'From account' }).selectOption('savings');

    await page.getByTestId('add-payee').click();
    await page.locator('#payee-name').fill(PAYEE.name);
    await page.getByLabel('Account number', { exact: true }).fill(PAYEE.account);
    // A aplicação bloqueia colagem na confirmação da conta: simular digitação.
    await page.locator('#payee-confirm-account').pressSequentially(PAYEE.account);
    await page.getByLabel('IFSC code').fill(PAYEE.ifsc);
    await page.getByRole('button', { name: 'Save payee' }).click();

    await page.locator('#amount').fill('2500');
    await page.getByTestId('mode-imps').click();
    await page.getByLabel('Remarks (optional)').fill('Rent');
  });

  await test.step('Revisar e confirmar a transferência', async () => {
    await page.getByRole('button', { name: 'Review transfer' }).click();
    await expect(page.getByTestId('review-payee')).toContainText(PAYEE.name);
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(page.locator('#otp-input')).toBeVisible();
  });
}

test.describe('TrustBank | Fluxos E2E com TypeScript', () => {
  test('E2E-01 | Login, beneficiário, transferência e comprovante', async ({ page }) => {
    await prepararTransferencia(page);

    await test.step('Validar OTP e conferir comprovante', async () => {
      await page.locator('#otp-input').fill(VALID_OTP);
      await page.getByRole('button', { name: 'Verify & transfer' }).click();

      await expect(page.getByTestId('transfer-success')).toBeVisible();
      await expect(page.getByTestId('transfer-amount')).toContainText('2,500.00');
      await expect(page.getByTestId('new-balance')).toContainText('1,22,930.50');
    });
  });

  test('E2E-02 | OTP incorreto impede a conclusão da transferência', async ({ page }) => {
    await prepararTransferencia(page);

    await test.step('Informar OTP incorreto e verificar bloqueio', async () => {
      await page.locator('#otp-input').fill('000000');
      await page.getByRole('button', { name: 'Verify & transfer' }).click();

      await expect(page.getByTestId('otp-error')).toBeVisible();
      await expect(page.getByTestId('transfer-success')).toBeHidden();
      await expect(page.locator('#otp-input')).toBeVisible();
    });
  });
});
