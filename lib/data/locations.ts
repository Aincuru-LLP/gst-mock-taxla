export interface StateOption {
  code: string;
  name: string;
  districts: string[];
}

export const INDIAN_STATES: StateOption[] = [
  {
    code: '27',
    name: 'Maharashtra',
    districts: [
      'Mumbai City',
      'Mumbai Suburban',
      'Pune',
      'Thane',
      'Nagpur',
      'Nashik',
      'Aurangabad',
      'Solapur',
      'Kolhapur',
      'Palghar'
    ]
  },
  {
    code: '29',
    name: 'Karnataka',
    districts: [
      'Bengaluru Urban',
      'Bengaluru Rural',
      'Mysuru',
      'Dakshina Kannada',
      'Belagavi',
      'Dharwad',
      'Tumakuru',
      'Udupi'
    ]
  },
  {
    code: '07',
    name: 'Delhi',
    districts: [
      'Central Delhi',
      'East Delhi',
      'New Delhi',
      'North Delhi',
      'North East Delhi',
      'North West Delhi',
      'South Delhi',
      'South East Delhi',
      'South West Delhi',
      'West Delhi'
    ]
  },
  {
    code: '33',
    name: 'Tamil Nadu',
    districts: [
      'Chennai',
      'Coimbatore',
      'Madurai',
      'Kanchipuram',
      'Chengalpattu',
      'Tiruchirappalli',
      'Salem',
      'Tiruppur'
    ]
  },
  {
    code: '24',
    name: 'Gujarat',
    districts: [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Rajkot',
      'Bhavnagar',
      'Gandhinagar',
      'Kutch'
    ]
  },
  {
    code: '09',
    name: 'Uttar Pradesh',
    districts: [
      'Gautam Buddha Nagar (Noida)',
      'Ghaziabad',
      'Lucknow',
      'Kanpur Nagar',
      'Varanasi',
      'Agra',
      'Prayagraj',
      'Meerut'
    ]
  },
  {
    code: '36',
    name: 'Telangana',
    districts: [
      'Hyderabad',
      'Medchal-Malkajgiri',
      'Rangareddy',
      'Sangareddy',
      'Warangal Urban'
    ]
  },
  {
    code: '19',
    name: 'West Bengal',
    districts: [
      'Kolkata',
      'North 24 Parganas',
      'South 24 Parganas',
      'Howrah',
      'Hooghly',
      'Darjeeling'
    ]
  },
  {
    code: '06',
    name: 'Haryana',
    districts: [
      'Gurugram',
      'Faridabad',
      'Panchkula',
      'Ambala',
      'Karnal',
      'Sonipat'
    ]
  },
  {
    code: '08',
    name: 'Rajasthan',
    districts: [
      'Jaipur',
      'Jodhpur',
      'Udaipur',
      'Kota',
      'Bikaner',
      'Ajmer'
    ]
  }
];

export function getDistrictsForState(stateName: string): string[] {
  const found = INDIAN_STATES.find(
    s => s.name.toLowerCase() === stateName.toLowerCase() || s.code === stateName
  );
  return found ? found.districts : ['Central', 'North', 'South', 'East', 'West'];
}

export function getStateCode(stateName: string): string {
  const found = INDIAN_STATES.find(
    s => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.code : '27';
}
