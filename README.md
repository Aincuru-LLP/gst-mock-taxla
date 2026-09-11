# TAXLA GST AUTOMATION — MOCK GST PORTAL

A dedicated, standalone functional mock Indian GST registration portal built as an automated target for **TAXLA Playwright automation workers**.

> [!IMPORTANT]
> **MOCK NOTICE**: This project is NOT the official Indian GST government website. It does NOT connect to `gst.gov.in`, GSTN production systems, or real government APIs. Every page and certificate displays visible notices indicating it is a test environment.

---

## 1. Quick Start

```powershell
# Install dependencies
npm install

# Run locally in development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run Playwright automated test suite
npm test
```

---

## 2. Key URLs for Automation

- **Main Playwright Entry Point**: `http://localhost:3000/registration/new` (or `https://<VERCEL-DOMAIN>/registration/new`)
- **TRN Login**: `/registration/trn-login`
- **Application Dashboard (10 Tabs)**: `/registration/application`
- **Certificate Form & Download**: `/registration/certificate`
- **Health Check**: `/health` (Returns `{"status":"ok","service":"taxla-gst-mock","environment":"demo","version":"1.0.0"}`)
- **Reset Demo Session**: `/?resetDemo=true` or `/registration/new?resetDemo=true`

---

## 3. Demo Credentials & Constants

- **Demo OTP**: `123456`
- **Demo CAPTCHA**: `1234` (or displayed characters `7K9P2`)
- **TRN Format**: `TRN202609XXXXXXXX` (synthetic)
- **ARN Format**: `ARN202609XXXXXXXXXXXX` (synthetic)
- **GSTIN Format**: `29ABCDE1234F1Z5` (synthetic)

---

## 4. Machine-Detectable Human Checkpoints

TAXLA Playwright workers detect human checkpoints via `data-testid`:
- Initial OTP: `data-testid="checkpoint-otp"` (`data-checkpoint-type="otp"`)
- CAPTCHA: `data-testid="checkpoint-captcha"` (`data-checkpoint-type="captcha"`)
- Aadhaar Verification: `data-testid="checkpoint-aadhaar"` (`data-checkpoint-type="aadhaar"`)
- Final EVC: `data-testid="checkpoint-final-otp"` (`data-checkpoint-type="otp"`)

---

## 5. Stable Selector Contract (`data-testid`)

- **Part A**: `gst-taxpayer-type`, `gst-state`, `gst-district`, `gst-legal-name`, `gst-pan`, `gst-email`, `gst-mobile`, `gst-captcha`, `gst-proceed`
- **OTP Checkpoints**: `gst-mobile-otp`, `gst-email-otp`, `gst-verify-otp`
- **TRN Display & Login**: `gst-trn`, `gst-trn-expiry`, `gst-trn-login`, `gst-trn-email`, `gst-trn-mobile`, `gst-trn-captcha`, `gst-trn-proceed`, `gst-trn-mobile-otp`, `gst-trn-email-otp`, `gst-trn-verify-otp`
- **Business Details**: `gst-business-legal-name`, `gst-business-trade-name`, `gst-constitution`, `gst-incorporation-date`, `gst-commencement-date`, `gst-reason`, `gst-rule-14a`, `gst-business-save`
- **Promoters**: `gst-promoter-first-name`, `gst-promoter-middle-name`, `gst-promoter-last-name`, `gst-promoter-dob`, `gst-promoter-pan`, `gst-promoter-aadhaar`, `gst-promoter-mobile`, `gst-promoter-email`, `gst-add-promoter`
- **Authorized Signatory**: `gst-signatory-name`, `gst-signatory-pan`, `gst-signatory-aadhaar`, `gst-signatory-mobile`, `gst-signatory-email`, `gst-signatory-photo`, `gst-signatory-proof`
- **Principal Place**: `gst-principal-door`, `gst-principal-building`, `gst-principal-street`, `gst-principal-city`, `gst-principal-state`, `gst-principal-district`, `gst-principal-pin`, `gst-premises-type`, `gst-address-proof`
- **Additional Places**: `gst-additional-place`
- **Goods & Services**: `gst-hsn-search`, `gst-hsn-result`, `gst-add-hsn`
- **Bank Accounts**: `gst-bank-name`, `gst-bank-account`, `gst-bank-account-confirm`, `gst-bank-ifsc`, `gst-add-bank`
- **Aadhaar Authentication**: `gst-aadhaar-auth`, `gst-aadhaar-number`, `gst-aadhaar-verify`, `gst-aadhaar-otp`
- **Verification**: `gst-declaration`, `gst-place`
- **Final EVC**: `gst-final-otp`, `gst-final-email-otp`, `gst-submit-evc`
- **ARN & GSTIN**: `gst-arn`, `gst-gstin`
- **Certificate**: `gst-download-certificate`
- **Completion**: `gst-success`, `gst-success-trn`, `gst-success-arn`, `gst-success-gstin`, `gst-success-certificate`

---

## 6. Playwright Test Suite Verification

Run:
```powershell
npx playwright test
```

All 4 test suites pass cleanly:
- Service Health Check (`/health`)
- Full 20-Step End-to-End Workflow (Start -> TRN -> Login -> 10 Tabs -> Aadhaar -> EVC -> ARN -> GSTIN -> PDF Certificate)
- Multi-Session Isolation (Application A vs Application B)
- Error / Exception Scenarios (`?scenario=otp-failure`)
