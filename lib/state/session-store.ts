import { GstApplicationState, SimulationScenario } from '@/types/gst';
import { getStateCode } from '@/lib/data/locations';

const ACTIVE_SESSION_KEY = 'taxla_active_gst_session_id';
const SESSION_PREFIX = 'taxla_gst_session_';

export function createInitialState(sessionId: string): GstApplicationState {
  const now = new Date();
  const expiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days

  return {
    applicationId: sessionId,
    taxpayerType: 'Taxpayer',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    legalName: '',
    pan: '',
    email: '',
    mobile: '',
    trn: '',
    trnStatus: 'PENDING',
    trnCreatedAt: now.toISOString(),
    trnExpiryDate: expiry.toISOString().split('T')[0],
    business: {
      legalName: '',
      tradeName: '',
      constitution: 'Proprietorship',
      pan: '',
      incorporationDate: '2024-01-15',
      commencementDate: '2024-02-01',
      reason: 'Crossing the threshold',
      existingRegistration: '',
      rule14a: 'No'
    },
    promoters: [
      {
        id: 'prom-1',
        firstName: 'RAMESH',
        middleName: 'KUMAR',
        lastName: 'SHARMA',
        dob: '1985-05-12',
        gender: 'Male',
        pan: 'ABCDE1234F',
        aadhaar: '234567890123',
        mobile: '9876543210',
        email: 'ramesh.sharma@demo-taxla.test',
        designation: 'Proprietor',
        residentialAddress: 'Flat 402, Green Valley Apartments, Indiranagar, Bengaluru, Karnataka - 560038',
        photoFileName: 'proprietor-photo.jpg'
      }
    ],
    signatory: {
      isPrimarySignatory: true,
      name: 'RAMESH KUMAR SHARMA',
      pan: 'ABCDE1234F',
      aadhaar: '234567890123',
      designation: 'Proprietor',
      mobile: '9876543210',
      email: 'ramesh.sharma@demo-taxla.test',
      photoFileName: 'signatory-photo.jpg',
      proofType: 'Letter of Authorization',
      proofFileName: 'loa-document.pdf'
    },
    principalPlace: {
      door: 'Plot No. 42',
      building: 'Tech Crest Tower',
      floor: '3rd Floor',
      street: '100 Feet Road',
      road: 'Indiranagar Main',
      area: 'HAL 2nd Stage',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      pin: '560038',
      officeEmail: 'office@demo-taxla.test',
      officeMobile: '9876543210',
      premisesType: 'Rented/Leased',
      possessionNature: 'Rent Agreement with Electricity Bill',
      addressProofType: 'Rent / Lease Agreement',
      addressProofFileName: 'rent-agreement-sample.pdf',
      activities: ['Retail Business', 'Office / Management', 'Service Provision']
    },
    additionalPlaces: [],
    goods: [],
    services: [
      {
        id: 'serv-1',
        type: 'SERVICES',
        code: '998314',
        description: 'Information technology (IT) design and development services',
        classification: 'Main'
      },
      {
        id: 'serv-2',
        type: 'SERVICES',
        code: '998313',
        description: 'Information technology (IT) consulting and support services',
        classification: 'Additional'
      }
    ],
    bankAccounts: [
      {
        id: 'bank-1',
        bankName: 'HDFC Bank',
        accountNumber: '50100234567890',
        confirmAccountNumber: '50100234567890',
        ifsc: 'HDFC0001234',
        accountType: 'Current',
        branch: 'Indiranagar, Bengaluru'
      }
    ],
    stateSpecific: {
      professionalTaxECNumber: 'PT-EC-29-987654',
      professionalTaxRCNumber: 'PT-RC-29-123456',
      stateExciseLicenseNumber: '',
      licenseHoldersName: 'RAMESH KUMAR SHARMA'
    },
    aadhaarAuthentication: {
      opted: 'YES',
      aadhaarNumber: '234567890123',
      isVerified: false
    },
    verification: {
      signatoryName: 'RAMESH KUMAR SHARMA',
      place: 'Bengaluru',
      declared: true,
      date: now.toISOString().split('T')[0]
    },
    arn: '',
    arnGeneratedAt: '',
    gstin: '',
    gstinStatus: 'PENDING',
    gstinGeneratedAt: '',
    status: 'DRAFT',
    completedTabs: {
      business: false,
      promoters: false,
      signatory: false,
      'principal-place': false,
      'additional-place': false,
      'goods-services': false,
      bank: false,
      'state-specific': false,
      aadhaar: false,
      verification: false
    },
    scenario: 'success'
  };
}

export function generateSessionId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `GST-DEMO-${year}-${randomSuffix}`;
}

export function getActiveSessionId(): string {
  if (typeof window === 'undefined') return 'GST-DEMO-2026-000001';

  // Check URL param first
  const params = new URLSearchParams(window.location.search);
  const urlSession = params.get('sessionId');
  if (urlSession) {
    localStorage.setItem(ACTIVE_SESSION_KEY, urlSession);
    return urlSession;
  }

  const existing = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (existing) return existing;

  const newId = generateSessionId();
  localStorage.setItem(ACTIVE_SESSION_KEY, newId);
  return newId;
}

export function setActiveSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
}

export function getSession(sessionId?: string): GstApplicationState {
  const targetId = sessionId || getActiveSessionId();
  if (typeof window === 'undefined') return createInitialState(targetId);

  const key = `${SESSION_PREFIX}${targetId}`;
  const raw = localStorage.getItem(key);
  let sessionState: GstApplicationState;
  if (raw) {
    try {
      sessionState = JSON.parse(raw);
    } catch {
      sessionState = createInitialState(targetId);
    }
  } else {
    sessionState = createInitialState(targetId);
  }

  // Check URL search params for scenario override
  const params = new URLSearchParams(window.location.search);
  const sc = params.get('scenario') as SimulationScenario | null;
  if (sc) {
    sessionState.scenario = sc;
    const saveKey = `${SESSION_PREFIX}${sessionState.applicationId}`;
    localStorage.setItem(saveKey, JSON.stringify(sessionState));
  }

  return sessionState;
}

export function saveSession(state: GstApplicationState): void {
  if (typeof window === 'undefined') return;
  const key = `${SESSION_PREFIX}${state.applicationId}`;
  localStorage.setItem(key, JSON.stringify(state));
  localStorage.setItem(ACTIVE_SESSION_KEY, state.applicationId);
}

export function resetSession(sessionId?: string): GstApplicationState {
  const targetId = sessionId || getActiveSessionId();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${SESSION_PREFIX}${targetId}`);
  }
  const freshId = generateSessionId();
  setActiveSessionId(freshId);
  const fresh = createInitialState(freshId);
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const sc = params.get('scenario') as SimulationScenario | null;
    if (sc) fresh.scenario = sc;
  }
  saveSession(fresh);
  return fresh;
}

export function generateSyntheticTrn(sessionId: string): string {
  const cleanId = sessionId.replace(/[^0-9]/g, '');
  const pad = (cleanId + '1234567890').substring(0, 8);
  return `TRN202609${pad}`;
}

export function generateSyntheticArn(trn: string): string {
  const clean = trn.replace(/[^0-9]/g, '');
  const timestamp = Date.now().toString().slice(-4);
  return `ARN202609${clean.slice(0, 6)}${timestamp}`;
}

export function generateSyntheticGstin(state: string, pan: string): string {
  const stateCode = getStateCode(state);
  const cleanPan = (pan || 'ABCDE1234F').toUpperCase();
  // Format: 2-digit state code + 10-char PAN + 1 entity code + Z + 5 checksum
  return `${stateCode}${cleanPan}1Z5`;
}

export function populateDemoData(sessionId?: string): GstApplicationState {
  const current = getSession(sessionId);
  const populated: GstApplicationState = {
    ...current,
    taxpayerType: 'Taxpayer',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    legalName: 'TAXLA DEMO TECHNOLOGIES PRIVATE LIMITED',
    pan: 'ABCDE1234F',
    email: 'contact@taxla-demo.test',
    mobile: '9876543210',
    trn: generateSyntheticTrn(current.applicationId),
    trnStatus: 'VERIFIED',
    business: {
      ...current.business,
      legalName: 'TAXLA DEMO TECHNOLOGIES PRIVATE LIMITED',
      tradeName: 'TAXLA TECH',
      constitution: 'Private Limited Company',
      pan: 'ABCDE1234F',
      incorporationDate: '2024-01-15',
      commencementDate: '2024-02-01',
      reason: 'Crossing the threshold',
      rule14a: 'No'
    },
    status: 'IN_PROGRESS',
    completedTabs: {
      business: true,
      promoters: true,
      signatory: true,
      'principal-place': true,
      'additional-place': true,
      'goods-services': true,
      bank: true,
      'state-specific': true,
      aadhaar: true,
      verification: true
    }
  };
  saveSession(populated);
  return populated;
}
