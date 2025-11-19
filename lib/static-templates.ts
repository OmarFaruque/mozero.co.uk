export interface Category {
  id: number
  slug: string
  name: string
  description: string
  icon: string
  is_active: boolean
}

export interface Template {
  id: number
  slug: string
  name: string
  description: string
  use_cases: string[]
  estimated_pages: string
  is_popular: boolean
  category_id: number
  category_slug: string
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    slug: 'disputes',
    name: 'Dispute Letters',
    description: 'Challenge incorrect charges, billing errors, and service disputes',
    icon: 'FileText',
    is_active: true
  },
  {
    id: 2,
    slug: 'insurance',
    name: 'Insurance',
    description: 'File claims for health, auto, property, and more',
    icon: 'Shield',
    is_active: true
  },
  {
    id: 3,
    slug: 'complaint',
    name: 'Complaint Letters',
    description: 'Formal complaints about products, services, and businesses',
    icon: 'AlertCircle',
    is_active: true
  },
  {
    id: 4,
    slug: 'appeal',
    name: 'Appeals',
    description: 'Appeal denied claims, decisions, and administrative actions',
    icon: 'Scale',
    is_active: true
  },
  {
    id: 5,
    slug: 'official',
    name: 'Official Documents',
    description: 'Request records, certifications, and official correspondence',
    icon: 'FileCheck',
    is_active: true
  }
]

export const TEMPLATES: Template[] = [
  // Dispute Letters
  {
    id: 1,
    slug: 'credit-card-dispute',
    name: 'Credit Card Dispute Letter',
    description: 'Dispute unauthorized or incorrect credit card charges',
    use_cases: ['Fraudulent charges', 'Billing errors', 'Service not received'],
    estimated_pages: '1-2 pages',
    is_popular: true,
    category_id: 1,
    category_slug: 'disputes'
  },
  {
    id: 2,
    slug: 'debt-validation',
    name: 'Debt Validation Letter',
    description: 'Request validation of debt from collection agencies',
    use_cases: ['Collection agency notices', 'Debt verification', 'Credit report disputes'],
    estimated_pages: '1 page',
    is_popular: false,
    category_id: 1,
    category_slug: 'disputes'
  },
  {
    id: 3,
    slug: 'billing-error-dispute',
    name: 'Billing Errors Dispute',
    description: 'Dispute billing mistakes and accounting errors',
    use_cases: ['Payment not credited', 'Late fees incorrectly applied', 'Service period errors'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 1,
    category_slug: 'disputes'
  },
  {
    id: 4,
    slug: 'incorrect-charges-dispute',
    name: 'Incorrect Charges Dispute',
    description: 'Challenge incorrect or unauthorized service fees',
    use_cases: ['Overcharges', 'Wrong pricing applied', 'Duplicate charges'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 1,
    category_slug: 'disputes'
  },
  {
    id: 5,
    slug: 'service-dispute',
    name: 'Service Disputes',
    description: 'Dispute poor service, undelivered services, or contract breaches',
    use_cases: ['Service not provided', 'Poor quality service', 'Incomplete work'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 1,
    category_slug: 'disputes'
  },
  
  // Insurance Claims
  {
    id: 6,
    slug: 'health-insurance-claim',
    name: 'Health Insurance Claim',
    description: 'File claims for medical expenses and treatments',
    use_cases: ['Medical bills', 'Hospital stays', 'Prescription costs'],
    estimated_pages: '2-3 pages',
    is_popular: true,
    category_id: 2,
    category_slug: 'insurance'
  },
  {
    id: 7,
    slug: 'auto-insurance-claim',
    name: 'Auto Insurance Claim',
    description: 'File claims for vehicle damage or accidents',
    use_cases: ['Collision damage', 'Theft', 'Vandalism'],
    estimated_pages: '2-3 pages',
    is_popular: false,
    category_id: 2,
    category_slug: 'insurance'
  },
  {
    id: 8,
    slug: 'property-insurance-claim',
    name: 'Property Insurance Claim',
    description: 'File claims for property damage or loss',
    use_cases: ['Fire damage', 'Water damage', 'Burglary'],
    estimated_pages: '2-3 pages',
    is_popular: false,
    category_id: 2,
    category_slug: 'insurance'
  },
  {
    id: 9,
    slug: 'life-insurance-claim',
    name: 'Life Insurance Claim',
    description: 'File beneficiary claims for life insurance policies',
    use_cases: ['Death benefit claims', 'Beneficiary disputes'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 2,
    category_slug: 'insurance'
  },
  {
    id: 10,
    slug: 'disability-insurance-claim',
    name: 'Disability Insurance Claim',
    description: 'File claims for disability benefits',
    use_cases: ['Short-term disability', 'Long-term disability', 'Work injury'],
    estimated_pages: '2-3 pages',
    is_popular: false,
    category_id: 2,
    category_slug: 'insurance'
  },
  
  // Complaint Letters
  {
    id: 11,
    slug: 'product-complaint',
    name: 'Product Complaint Letter',
    description: 'Complain about defective or unsatisfactory products',
    use_cases: ['Defective products', 'False advertising', 'Warranty issues'],
    estimated_pages: '1-2 pages',
    is_popular: true,
    category_id: 3,
    category_slug: 'complaint'
  },
  {
    id: 12,
    slug: 'service-complaint',
    name: 'Service Complaint Letter',
    description: 'Formal complaint about poor or unsatisfactory service',
    use_cases: ['Rude staff', 'Delayed service', 'Unprofessional conduct'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 3,
    category_slug: 'complaint'
  },
  {
    id: 13,
    slug: 'business-complaint',
    name: 'Business Complaint Letter',
    description: 'Complaint about business practices or policies',
    use_cases: ['Unfair policies', 'Contract violations', 'Deceptive practices'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 3,
    category_slug: 'complaint'
  },
  {
    id: 14,
    slug: 'landlord-complaint',
    name: 'Landlord Complaint Letter',
    description: 'Complaint to landlord about property issues',
    use_cases: ['Maintenance issues', 'Lease violations', 'Noise complaints'],
    estimated_pages: '1 page',
    is_popular: false,
    category_id: 3,
    category_slug: 'complaint'
  },
  {
    id: 15,
    slug: 'workplace-complaint',
    name: 'Workplace Complaint Letter',
    description: 'Formal complaint about workplace issues',
    use_cases: ['Harassment', 'Discrimination', 'Unsafe conditions'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 3,
    category_slug: 'complaint'
  },
  
  // Appeals
  {
    id: 16,
    slug: 'insurance-denial-appeal',
    name: 'Insurance Denial Appeal',
    description: 'Appeal denied insurance claims',
    use_cases: ['Claim denials', 'Coverage disputes', 'Pre-authorization denials'],
    estimated_pages: '2-3 pages',
    is_popular: true,
    category_id: 4,
    category_slug: 'appeal'
  },
  {
    id: 17,
    slug: 'medical-bill-appeal',
    name: 'Medical Bill Appeal',
    description: 'Appeal medical billing decisions',
    use_cases: ['Overcharges', 'Insurance processing errors', 'Out-of-network disputes'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 4,
    category_slug: 'appeal'
  },
  {
    id: 18,
    slug: 'benefits-denial-appeal',
    name: 'Benefits Denial Appeal',
    description: 'Appeal denied government or employer benefits',
    use_cases: ['Social Security denials', 'Unemployment benefits', 'VA benefits'],
    estimated_pages: '2-3 pages',
    is_popular: false,
    category_id: 4,
    category_slug: 'appeal'
  },
  {
    id: 19,
    slug: 'academic-appeal',
    name: 'Academic Appeal Letter',
    description: 'Appeal academic decisions or disciplinary actions',
    use_cases: ['Grade appeals', 'Suspension appeals', 'Financial aid appeals'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 4,
    category_slug: 'appeal'
  },
  {
    id: 20,
    slug: 'parking-ticket-appeal',
    name: 'Parking Ticket Appeal',
    description: 'Appeal parking tickets and traffic citations',
    use_cases: ['Unfair tickets', 'Signage issues', 'Meter malfunctions'],
    estimated_pages: '1 page',
    is_popular: false,
    category_id: 4,
    category_slug: 'appeal'
  },
  
  // Official Documents
  {
    id: 21,
    slug: 'records-request',
    name: 'Records Request Letter',
    description: 'Request official records and documentation',
    use_cases: ['Medical records', 'Employment records', 'School transcripts'],
    estimated_pages: '1 page',
    is_popular: true,
    category_id: 5,
    category_slug: 'official'
  },
  {
    id: 22,
    slug: 'certification-request',
    name: 'Certification Request',
    description: 'Request official certifications and verifications',
    use_cases: ['Employment verification', 'Income certification', 'Residency proof'],
    estimated_pages: '1 page',
    is_popular: false,
    category_id: 5,
    category_slug: 'official'
  },
  {
    id: 23,
    slug: 'government-correspondence',
    name: 'Government Correspondence',
    description: 'Official letters to government agencies',
    use_cases: ['FOIA requests', 'Agency inquiries', 'Permit applications'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 5,
    category_slug: 'official'
  },
  {
    id: 24,
    slug: 'legal-notice',
    name: 'Legal Notice Letter',
    description: 'Formal legal notifications and demands',
    use_cases: ['Cease and desist', 'Demand letters', 'Notice of intent'],
    estimated_pages: '1-2 pages',
    is_popular: false,
    category_id: 5,
    category_slug: 'official'
  },
  {
    id: 25,
    slug: 'reference-request',
    name: 'Reference Request Letter',
    description: 'Request professional or character references',
    use_cases: ['Job applications', 'Rental applications', 'Character references'],
    estimated_pages: '1 page',
    is_popular: false,
    category_id: 5,
    category_slug: 'official'
  }
]

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(cat => cat.slug === slug && cat.is_active)
}

export function getTemplatesByCategory(categorySlug: string): Template[] {
  return TEMPLATES.filter(template => template.category_slug === categorySlug)
}

export function getTemplateBySlug(categorySlug: string, templateSlug: string): Template | undefined {
  return TEMPLATES.find(
    template => template.category_slug === categorySlug && template.slug === templateSlug
  )
}

export function getAllCategories(): Category[] {
  return CATEGORIES.filter(cat => cat.is_active)
}
