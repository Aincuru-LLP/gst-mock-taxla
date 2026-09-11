import { test, expect } from '@playwright/test';

test.describe('TAXLA GST AUTOMATION — MOCK GST PORTAL', () => {

  test('0. Service Health Check (/health) returns status ok', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toEqual({
      status: 'ok',
      service: 'taxla-gst-mock',
      environment: 'demo',
      version: '1.0.0'
    });
  });

  test('1. Full 20-Step End-to-End Workflow (START -> TRN -> LOGIN -> ALL TABS -> AADHAAR -> EVC -> ARN -> GSTIN -> CERTIFICATE)', async ({ page }) => {
    // 1. Open New Registration starting route
    await page.goto('/registration/new?resetDemo=true');
    await expect(page).toHaveTitle(/TAXLA GST AUTOMATION/);
    await expect(page.locator('text=TAXLA GST AUTOMATION DEMO').first()).toBeVisible();
    await expect(page.locator('text=MOCK PORTAL — NOT A GOVERNMENT WEBSITE').first()).toBeVisible();

    // Verify Checkpoint: CAPTCHA
    const captchaCheckpoint = page.locator('[data-testid="checkpoint-captcha"]');
    await expect(captchaCheckpoint).toBeVisible();

    // 2. Enter applicant information
    await page.selectOption('[data-testid="gst-taxpayer-type"]', 'Taxpayer');
    await page.selectOption('[data-testid="gst-state"]', 'Karnataka');
    await page.selectOption('[data-testid="gst-district"]', 'Bengaluru Urban');
    await page.fill('[data-testid="gst-legal-name"]', 'TAXLA AUTOMATION TEST LABS PVT LTD');
    await page.fill('[data-testid="gst-pan"]', 'ABCDE1234F');
    await page.fill('[data-testid="gst-email"]', 'automation@taxla-demo.test');
    await page.fill('[data-testid="gst-mobile"]', '9876543210');
    await page.fill('[data-testid="gst-captcha"]', '1234');

    // 3. Submit Part A
    await page.click('[data-testid="gst-proceed"]');

    // 4. Initial OTP Checkpoint
    await expect(page).toHaveURL(/\/registration\/new\/verify/);
    const initialOtpCheckpoint = page.locator('[data-testid="checkpoint-otp"]');
    await expect(initialOtpCheckpoint).toBeVisible();
    await expect(initialOtpCheckpoint).toHaveAttribute('data-checkpoint-type', 'otp');

    await page.fill('[data-testid="gst-mobile-otp"]', '123456');
    await page.fill('[data-testid="gst-email-otp"]', '123456');
    await page.click('[data-testid="gst-verify-otp"]');

    // 5. TRN Generated Page
    await expect(page).toHaveURL(/\/registration\/trn-generated/);
    const trnElement = page.locator('[data-testid="gst-trn"]');
    await expect(trnElement).toBeVisible();
    const generatedTrn = await trnElement.innerText();
    expect(generatedTrn).toMatch(/^TRN202609/);
    await expect(page.locator('[data-testid="gst-trn-expiry"]')).toBeVisible();

    // 6. Proceed to TRN Login
    await page.click('text=Proceed to TRN Login');
    await expect(page).toHaveURL(/\/registration\/trn-login/);

    // 7. TRN Login Form
    await expect(page.locator('[data-testid="checkpoint-captcha"]')).toBeVisible();
    await page.fill('[data-testid="gst-trn-login"]', generatedTrn);
    await page.fill('[data-testid="gst-trn-email"]', 'automation@taxla-demo.test');
    await page.fill('[data-testid="gst-trn-mobile"]', '9876543210');
    await page.fill('[data-testid="gst-trn-captcha"]', '1234');
    await page.click('[data-testid="gst-trn-proceed"]');

    // 8. Second OTP Checkpoint
    await expect(page).toHaveURL(/\/registration\/trn-login\/verify/);
    await expect(page.locator('[data-testid="checkpoint-otp"]')).toBeVisible();
    await page.fill('[data-testid="gst-trn-mobile-otp"]', '123456');
    await page.fill('[data-testid="gst-trn-email-otp"]', '123456');
    await page.click('[data-testid="gst-trn-verify-otp"]');

    // 9. Application Dashboard
    await expect(page).toHaveURL(/\/registration\/application/);
    await expect(page.locator('text=Business Details').first()).toBeVisible();

    // 10. Tab 1: Business Details
    await page.goto('/registration/application/business');
    await expect(page.locator('[data-testid="gst-business-legal-name"]')).toHaveValue('TAXLA AUTOMATION TEST LABS PVT LTD');
    await page.fill('[data-testid="gst-business-trade-name"]', 'TAXLA TECH LABS');
    await page.selectOption('[data-testid="gst-constitution"]', 'Private Limited Company');
    await page.fill('[data-testid="gst-incorporation-date"]', '2024-01-15');
    await page.fill('[data-testid="gst-commencement-date"]', '2024-02-01');
    await page.selectOption('[data-testid="gst-reason"]', 'Crossing the threshold');
    await page.selectOption('[data-testid="gst-rule-14a"]', 'No');
    await page.click('[data-testid="gst-business-save"]');

    // 11. Tab 2: Promoters
    await expect(page).toHaveURL(/\/registration\/application\/promoters/);
    await page.fill('[data-testid="gst-promoter-first-name"]', 'SURESH');
    await page.fill('[data-testid="gst-promoter-middle-name"]', 'KUMAR');
    await page.fill('[data-testid="gst-promoter-last-name"]', 'PATEL');
    await page.fill('[data-testid="gst-promoter-dob"]', '1988-06-20');
    await page.fill('[data-testid="gst-promoter-pan"]', 'ABCDE1234F');
    await page.fill('[data-testid="gst-promoter-aadhaar"]', '234567890123');
    await page.fill('[data-testid="gst-promoter-mobile"]', '9876543210');
    await page.fill('[data-testid="gst-promoter-email"]', 'suresh@demo-taxla.test');
    await page.click('[data-testid="gst-add-promoter"]');
    await page.click('button:has-text("Save & Continue")');

    // 12. Tab 3: Authorized Signatory
    await expect(page).toHaveURL(/\/registration\/application\/signatory/);
    await page.fill('[data-testid="gst-signatory-name"]', 'SURESH KUMAR PATEL');
    await page.fill('[data-testid="gst-signatory-pan"]', 'ABCDE1234F');
    await page.fill('[data-testid="gst-signatory-aadhaar"]', '234567890123');
    await page.fill('[data-testid="gst-signatory-mobile"]', '9876543210');
    await page.fill('[data-testid="gst-signatory-email"]', 'suresh@demo-taxla.test');
    await page.click('button:has-text("Save & Continue")');

    // 13. Tab 4: Principal Place of Business
    await expect(page).toHaveURL(/\/registration\/application\/principal-place/);
    await page.fill('[data-testid="gst-principal-door"]', 'Unit 101');
    await page.fill('[data-testid="gst-principal-building"]', 'Automation Plaza');
    await page.fill('[data-testid="gst-principal-street"]', 'Ring Road');
    await page.fill('[data-testid="gst-principal-city"]', 'Bengaluru');
    await page.fill('[data-testid="gst-principal-pin"]', '560038');
    await page.selectOption('[data-testid="gst-premises-type"]', 'Rented/Leased');
    await page.click('button:has-text("Save & Continue")');

    // 14. Tab 5: Additional Places of Business
    await expect(page).toHaveURL(/\/registration\/application\/additional-place/);
    await page.click('#has-additional');
    await page.fill('#additional-building', 'Warehouse Central');
    await page.fill('#additional-city', 'Mysuru');
    await page.fill('#additional-pin', '570001');
    await page.click('[data-testid="gst-additional-place"]');
    await page.click('button:has-text("Save & Continue")');

    // 15. Tab 6: Goods & Services
    await expect(page).toHaveURL(/\/registration\/application\/goods-services/);
    await page.fill('[data-testid="gst-hsn-search"]', '998314');
    const hsnResult = page.locator('[data-testid="gst-hsn-result"]').first();
    if (await hsnResult.isVisible()) {
      await hsnResult.click();
    }
    await page.click('[data-testid="gst-add-hsn"]');
    await page.click('button:has-text("Save & Continue")');

    // 16. Tab 7: Bank Accounts
    await expect(page).toHaveURL(/\/registration\/application\/bank/);
    await page.fill('[data-testid="gst-bank-name"]', 'State Bank of India');
    await page.fill('[data-testid="gst-bank-account"]', '3020011223344');
    await page.fill('[data-testid="gst-bank-account-confirm"]', '3020011223344');
    await page.fill('[data-testid="gst-bank-ifsc"]', 'SBIN0001234');
    await page.click('[data-testid="gst-add-bank"]');
    await page.click('button:has-text("Save & Continue")');

    // 17. Tab 8: State Specific
    await expect(page).toHaveURL(/\/registration\/application\/state-specific/);
    await page.click('button:has-text("Save & Continue")');

    // 18. Tab 9: Aadhaar Authentication Checkpoint
    await expect(page).toHaveURL(/\/registration\/application\/aadhaar/);
    const aadhaarCheckpoint = page.locator('[data-testid="checkpoint-aadhaar"]');
    await expect(aadhaarCheckpoint).toBeVisible();
    await page.fill('[data-testid="gst-aadhaar-number"]', '234567890123');
    await page.click('[data-testid="gst-aadhaar-verify"]');
    await page.fill('[data-testid="gst-aadhaar-otp"]', '123456');
    await page.click('button:has-text("Verify Aadhaar OTP")');
    await expect(page.locator('text=Aadhaar Authentication Successful').first()).toBeVisible();
    await page.click('button:has-text("Save & Continue")');

    // 19. Tab 10: Verification & Statutory Declaration
    await expect(page).toHaveURL(/\/registration\/application\/verification/);
    const declaration = page.locator('[data-testid="gst-declaration"]');
    if (!(await declaration.isChecked())) {
      await declaration.check();
    }
    await page.fill('[data-testid="gst-place"]', 'Bengaluru');
    await page.click('button:has-text("Proceed to EVC")');

    // 20. Final Human Checkpoint: EVC
    await expect(page).toHaveURL(/\/registration\/application\/evc/);
    const evcCheckpoint = page.locator('[data-testid="checkpoint-final-otp"]');
    await expect(evcCheckpoint).toBeVisible();
    await expect(evcCheckpoint).toHaveAttribute('data-checkpoint-type', 'otp');
    await page.fill('[data-testid="gst-final-otp"]', '123456');
    await page.fill('[data-testid="gst-final-email-otp"]', '123456');
    await page.click('[data-testid="gst-submit-evc"]');

    // 21. ARN Generation & Status Progression
    await expect(page).toHaveURL(/\/registration\/application\/arn/);
    const arnElement = page.locator('[data-testid="gst-arn"]');
    await expect(arnElement).toBeVisible();
    const arnText = await arnElement.innerText();
    expect(arnText).toMatch(/^ARN202609/);

    // Wait for deterministic GSTIN generation (completes in ~7.5s)
    const gstinElement = page.locator('[data-testid="gst-gstin"]');
    await expect(gstinElement).toBeVisible({ timeout: 15000 });
    const gstinText = await gstinElement.innerText();
    expect(gstinText).toMatch(/^29[A-Z]{5}[0-9]{4}[A-Z]{1}1Z5$/);

    // 22. Certificate Download
    await page.click('text=View & Download Certificate');
    await expect(page).toHaveURL(/\/registration\/certificate/);
    const downloadBtn = page.locator('[data-testid="gst-download-certificate"]');
    await expect(downloadBtn).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('GST-DEMO-CERTIFICATE');

    // 23. Completion Summary Page
    await page.goto('/registration/application/success');
    await expect(page.locator('[data-testid="gst-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="gst-success-trn"]')).toBeVisible();
    await expect(page.locator('[data-testid="gst-success-arn"]')).toBeVisible();
    await expect(page.locator('[data-testid="gst-success-gstin"]')).toBeVisible();
    await expect(page.locator('[data-testid="gst-success-certificate"]')).toBeVisible();
  });

  test('2. Multi-Session Isolation (App A vs App B)', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // App A enters Maharashtra details
    await pageA.goto('/registration/new?resetDemo=true');
    await pageA.fill('[data-testid="gst-legal-name"]', 'APPLICATION A ENTERPRISES');
    await pageA.selectOption('[data-testid="gst-state"]', 'Maharashtra');
    await pageA.fill('[data-testid="gst-pan"]', 'AAAAA1111A');
    await pageA.fill('[data-testid="gst-email"]', 'appa@taxla.test');
    await pageA.fill('[data-testid="gst-mobile"]', '9111111111');
    await pageA.fill('[data-testid="gst-captcha"]', '1234');
    await pageA.click('[data-testid="gst-proceed"]');

    // App B enters Gujarat details
    await pageB.goto('/registration/new?resetDemo=true');
    await pageB.fill('[data-testid="gst-legal-name"]', 'APPLICATION B ENTERPRISES');
    await pageB.selectOption('[data-testid="gst-state"]', 'Gujarat');
    await pageB.fill('[data-testid="gst-pan"]', 'BBBBB2222B');
    await pageB.fill('[data-testid="gst-email"]', 'appb@taxla.test');
    await pageB.fill('[data-testid="gst-mobile"]', '9222222222');
    await pageB.fill('[data-testid="gst-captcha"]', '1234');
    await pageB.click('[data-testid="gst-proceed"]');

    // Verify App A OTP screen shows App A email
    await expect(pageA).toHaveURL(/\/registration\/new\/verify/);
    await expect(pageA.locator('text=ap******@taxla.test')).toBeVisible();

    // Verify App B OTP screen shows App B email
    await expect(pageB).toHaveURL(/\/registration\/new\/verify/);
    await expect(pageB.locator('text=ap******@taxla.test')).toBeVisible();

    await contextA.close();
    await contextB.close();
  });

  test('3. Scenarios: Deterministic OTP and CAPTCHA Failures', async ({ page }) => {
    // OTP failure scenario
    await page.goto('/registration/new?resetDemo=true&scenario=otp-failure');
    await page.fill('[data-testid="gst-legal-name"]', 'TAXLA FAILURE TEST');
    await page.fill('[data-testid="gst-pan"]', 'ABCDE1234F');
    await page.fill('[data-testid="gst-email"]', 'fail@taxla.test');
    await page.fill('[data-testid="gst-mobile"]', '9876543210');
    await page.fill('[data-testid="gst-captcha"]', '1234');
    await page.click('[data-testid="gst-proceed"]');

    await expect(page).toHaveURL(/\/registration\/new\/verify/);
    await page.fill('[data-testid="gst-mobile-otp"]', '123456');
    await page.fill('[data-testid="gst-email-otp"]', '123456');
    await page.click('[data-testid="gst-verify-otp"]');

    // Should stay on page and show error
    await expect(page.locator('text=Invalid OTP entered')).toBeVisible();
  });

});
