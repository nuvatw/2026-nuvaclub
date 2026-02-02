// Checkout Types and Interfaces

export type CartItemType =
  | 'digital_plan'
  | 'duo_go'
  | 'duo_run'
  | 'duo_fly'
  | 'explorer_upgrade'
  | 'physical_course'
  | 'merchandise'
  | 'subscription'; // Monthly auto-renewing subscription

export type DuoPeriodType = 'month' | 'quarter';

export interface DuoPeriod {
  id: string;
  label: string; // e.g., "January 2026" or "2026 Q1"
  year: number;
  month?: number; // 1-12 for monthly (Duo Go)
  quarter?: number; // 1-4 for quarterly (Duo Run/Fly)
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number; // in NT$ (price per period for Duo)
  quantity: number;
  type: CartItemType;
  image?: string;
  // For plans
  monthlyAverage?: number;
  // For merchandise
  requiresShipping?: boolean;
  // For courses
  requiresCourseDetails?: boolean;
  // For explorer upgrade
  isExplorerUpgrade?: boolean;
  // For Duo products
  duoPeriodType?: DuoPeriodType; // 'month' for Duo Go, 'quarter' for Duo Run/Fly
  selectedPeriods?: DuoPeriod[]; // Selected months or quarters
  // For subscription
  subscriptionType?: 'monthly' | 'yearly'; // Subscription billing cycle
}

export interface PurchaserInfo {
  fullName: string;
  email: string;
  phone: string;
  invoiceType: 'personal' | 'company';
  companyVatNumber?: string;
  companyName?: string;
}

export interface ParticipantInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface CourseParticipantInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  dietaryRestrictions?: string;
}

export interface PlanInfo {
  dateOfBirth: string;
}

export interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  shippingMethod: 'seven_eleven';
  storeId?: string;
  storeName?: string;
  storeAddress?: string;
}

export type PaymentMethod = 'credit_card' | 'atm_transfer';

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  cardDetails?: CardDetails;
  prime?: string; // TapPay Prime token

  // Installment options
  enableInstallment?: boolean; // Whether installment is available for this order
  installment?: {
    bank: 'ctbc' | 'esun'; // 中信 or 玉山
    periods: 3 | 6;
  };

  // TapPay validation status
  canGetPrime?: boolean; // Whether TapPay card fields are valid and ready
}

export type CheckoutStepId =
  | 'confirm_cart'
  | 'purchaser_info'
  | 'payment_info'
  | 'plan_info'
  | 'course_participant_details'
  | 'delivery_info'
  | 'participant_info'
  | 'review';

export interface CheckoutStep {
  id: CheckoutStepId;
  label: string;
  number: number;
}

export interface CheckoutState {
  // Cart
  items: CartItem[];
  quantity: number;

  // Form data
  purchaserInfo: PurchaserInfo;
  paymentInfo: PaymentInfo;
  planInfo: PlanInfo;
  participants: ParticipantInfo[];
  courseParticipants: CourseParticipantInfo[];
  deliveryInfo: DeliveryInfo;

  // Navigation
  currentStepIndex: number;
  steps: CheckoutStep[];

  // Validation
  completedSteps: Set<CheckoutStepId>;

  // Terms
  agreedToTerms: boolean;

  // Submission
  isSubmitting: boolean;
  error?: string;
}

export interface CheckoutContextValue {
  state: CheckoutState;

  // Navigation
  goToStep: (stepId: CheckoutStepId) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Data updates
  setQuantity: (quantity: number) => void;
  setPurchaserInfo: (info: Partial<PurchaserInfo>) => void;
  setPaymentInfo: (info: Partial<PaymentInfo>) => void;
  setPlanInfo: (info: Partial<PlanInfo>) => void;
  setParticipant: (index: number, info: Partial<ParticipantInfo>) => void;
  setCourseParticipant: (index: number, info: Partial<CourseParticipantInfo>) => void;
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  setAgreedToTerms: (agreed: boolean) => void;

  // Utilities
  usePurchaserInfoForParticipant: (index: number) => void;
  usePurchaserInfoForCourseParticipant: (index: number) => void;
  usePurchaserInfoForDelivery: () => void;

  // Validation
  isCurrentStepValid: () => boolean;
  markStepComplete: (stepId: CheckoutStepId) => void;

  // Cart helpers
  getTotalPrice: () => number;
  getUnitPrice: () => number;

  // Step helpers
  getCurrentStep: () => CheckoutStep | undefined;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;

  // TapPay integration
  requestPrime: () => Promise<string>;
  tappayRef: React.RefObject<any>;

  // Submission
  submitOrder: () => Promise<{ ok: boolean; data?: any; msg?: string }>;
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parentheses, and plus sign
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{8,15}$/.test(cleanedPhone);
}

export function isValidVatNumber(vat: string): boolean {
  return /^\d{8}$/.test(vat);
}

export function isValidCardNumber(number: string): boolean {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

export function isValidExpiryDate(date: string): boolean {
  const match = date.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  if (month < 1 || month > 12) return false;
  // Check if card is not expired (allow current month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth is 0-indexed
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export function isValidCvc(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

export function isValidDateOfBirth(dob: string): boolean {
  if (!dob) return false;
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  return date < now;
}

export function formatCurrency(amount: number): string {
  return `NT$${amount.toLocaleString()}`;
}
