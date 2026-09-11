export type ApplicationStatus =
  | 'DRAFT'
  | 'TRN_GENERATED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'ARN_GENERATED'
  | 'PENDING_PROCESSING'
  | 'UNDER_PROCESSING'
  | 'APPROVED'
  | 'GSTIN_GENERATED'
  | 'COMPLETED';

export type SimulationScenario =
  | 'success'
  | 'otp-failure'
  | 'captcha-failure'
  | 'validation-error'
  | 'processing-delay'
  | 'clarification';

export interface BusinessDetails {
  legalName: string;
  tradeName: string;
  constitution: string;
  pan: string;
  incorporationDate: string;
  commencementDate: string;
  reason: string;
  existingRegistration: string;
  rule14a: 'Yes' | 'No';
}

export interface PromoterDetails {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: string;
  pan: string;
  aadhaar: string;
  mobile: string;
  email: string;
  designation: string;
  residentialAddress: string;
  photoFileName?: string;
}

export interface SignatoryDetails {
  isPrimarySignatory: boolean;
  name: string;
  pan: string;
  aadhaar: string;
  designation: string;
  mobile: string;
  email: string;
  photoFileName?: string;
  proofType: string;
  proofFileName?: string;
}

export interface PlaceDetails {
  door: string;
  building: string;
  floor?: string;
  street: string;
  road?: string;
  area: string;
  locality?: string;
  city: string;
  state: string;
  district: string;
  pin: string;
  officeEmail: string;
  officeMobile: string;
  premisesType: 'Owned' | 'Rented/Leased' | 'Consent/Shared' | 'Other';
  possessionNature: string;
  addressProofType: string;
  addressProofFileName?: string;
  activities: string[];
}

export interface AdditionalPlaceDetails {
  id: string;
  door: string;
  building: string;
  street: string;
  city: string;
  state: string;
  district: string;
  pin: string;
  premisesType: string;
  addressProofType: string;
  natureOfActivity: string;
}

export interface GoodsServiceItem {
  id: string;
  type: 'GOODS' | 'SERVICES';
  code: string; // HSN or SAC
  description: string;
  classification: 'Main' | 'Additional';
}

export interface BankAccountDetails {
  id: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  accountType: 'Current' | 'Savings' | 'Cash Credit';
  branch: string;
}

export interface StateSpecificDetails {
  professionalTaxECNumber: string;
  professionalTaxRCNumber: string;
  stateExciseLicenseNumber: string;
  licenseHoldersName: string;
}

export interface AadhaarDetails {
  opted: 'YES' | 'NO';
  aadhaarNumber: string;
  isVerified: boolean;
  verificationDate?: string;
}

export interface VerificationDetails {
  signatoryName: string;
  place: string;
  declared: boolean;
  date: string;
}

export interface GstApplicationState {
  applicationId: string;
  taxpayerType: string;
  state: string;
  district: string;
  legalName: string;
  pan: string;
  email: string;
  mobile: string;
  trn: string;
  trnStatus: 'PENDING' | 'GENERATED' | 'VERIFIED';
  trnCreatedAt: string;
  trnExpiryDate: string;
  business: BusinessDetails;
  promoters: PromoterDetails[];
  signatory: SignatoryDetails;
  principalPlace: PlaceDetails;
  additionalPlaces: AdditionalPlaceDetails[];
  goods: GoodsServiceItem[];
  services: GoodsServiceItem[];
  bankAccounts: BankAccountDetails[];
  stateSpecific: StateSpecificDetails;
  aadhaarAuthentication: AadhaarDetails;
  verification: VerificationDetails;
  arn: string;
  arnGeneratedAt: string;
  gstin: string;
  gstinStatus: 'PENDING' | 'GENERATED';
  gstinGeneratedAt: string;
  status: ApplicationStatus;
  completedTabs: {
    business: boolean;
    promoters: boolean;
    signatory: boolean;
    'principal-place': boolean;
    'additional-place': boolean;
    'goods-services': boolean;
    bank: boolean;
    'state-specific': boolean;
    aadhaar: boolean;
    verification: boolean;
  };
  scenario: SimulationScenario;
}
