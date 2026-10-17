export const PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
];

export const CATEGORIES = [
  'All',
  'Cultural Heritage',
  'Beaches & Coastal',
  'Hill Country & Tea',
  'Wildlife & Safari',
  'Nature & Adventure',
  'Urban & Modern',
];

export const STARTING_LOCATIONS = [
  { name: 'Colombo', latitude: 6.9271, longitude: 79.8612, desc: 'Commercial Capital & Western Hub' },
  { name: 'Bandaranaike International Airport', latitude: 7.1808, longitude: 79.8841, desc: 'Katunayake (BIA) Arrival Point' },
  { name: 'Kandy', latitude: 7.2906, longitude: 80.6337, desc: 'Central Hill Capital' },
  { name: 'Galle', latitude: 6.0328, longitude: 80.217, desc: 'Southern Coastal Gateway' },
  { name: 'Ella', latitude: 6.8667, longitude: 81.0466, desc: 'Highland Trekking Sanctuary' },
];

export const DURATION_OPTIONS = [
  { days: 2, label: '2 Days (Weekend Getaway)' },
  { days: 3, label: '3 Days (Short Explorer)' },
  { days: 5, label: '5 Days (Classic Island Circuit)' },
  { days: 7, label: '7 Days (One Week Grand Tour)' },
  { days: 10, label: '10 Days (Comprehensive Discovery)' },
  { days: 14, label: '14 Days (Ultimate Island Odyssey)' },
];

export const BUDGET_TIERS = [
  {
    id: 'Budget',
    title: 'Budget Explorer',
    costRange: 'LKR 10,000 - 18,000 / day',
    desc: 'Guesthouses, local cafes, public transit & scenic trains.',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  },
  {
    id: 'Moderate',
    title: 'Comfort Traveler',
    costRange: 'LKR 20,000 - 35,000 / day',
    desc: '3-4 star boutique hotels, private driver / AC cars, popular dining.',
    color: 'border-blue-500 bg-blue-50 text-blue-900',
  },
  {
    id: 'Luxury',
    title: 'Luxury Connoisseur',
    costRange: 'LKR 50,000+ / day',
    desc: '5-star heritage villas, wellness spas, fine cuisine, private guide.',
    color: 'border-amber-500 bg-amber-50 text-amber-900',
  },
];

export const TRAVEL_GROUPS = [
  { id: 'Solo', label: 'Solo Traveler', icon: 'User' },
  { id: 'Couple', label: 'Couple / Romantic', icon: 'Heart' },
  { id: 'Family', label: 'Family with Kids', icon: 'Users' },
  { id: 'Friends', label: 'Friends Group', icon: 'Smile' },
];

export const INTEREST_OPTIONS = [
  { id: 'Beaches', label: 'Beaches & Oceans', icon: 'Palmtree' },
  { id: 'Wildlife', label: 'Wildlife & Safari', icon: 'PawPrint' },
  { id: 'Nature', label: 'Nature & Parks', icon: 'TreePine' },
  { id: 'Hiking', label: 'Hiking & Trekking', icon: 'Mountain' },
  { id: 'Adventure', label: 'Adventure Sports', icon: 'Compass' },
  { id: 'Culture', label: 'Ancient Culture', icon: 'Landmark' },
  { id: 'History', label: 'Colonial History', icon: 'BookOpen' },
  { id: 'Food', label: 'Sri Lankan Cuisine', icon: 'Utensils' },
  { id: 'Photography', label: 'Scenic Photography', icon: 'Camera' },
  { id: 'Shopping', label: 'Boutiques & Gems', icon: 'ShoppingBag' },
  { id: 'Surfing', label: 'Surfing & Waves', icon: 'Waves' },
  { id: 'Tea', label: 'Tea Plantations', icon: 'Coffee' },
  { id: 'Waterfalls', label: 'Cascading Falls', icon: 'Droplets' },
];

export const TRANSPORT_OPTIONS = [
  { id: 'Private Car', label: 'Private Car & Driver', desc: 'Highest flexibility, AC comfort and local driver expertise.' },
  { id: 'Rental Vehicle', label: 'Self-Drive Rental', desc: 'Freedom to navigate at your own pace.' },
  { id: 'Train', label: 'Scenic Railway', desc: 'World-famous iconic routes like Kandy to Ella.' },
  { id: 'Bus', label: 'Express Highway Bus', desc: 'Fast, budget-friendly connections between major towns.' },
  { id: 'Public Transport', label: 'Public Transport Combo', desc: 'Authentic local immersion for backpackers.' },
];
