'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  type CartItem,
  type CheckoutState,
  type CheckoutContextValue,
  type CheckoutStep,
  type CheckoutStepId,
  type PurchaserInfo,
  type PaymentInfo,
  type PlanInfo,
  type ParticipantInfo,
  type CourseParticipantInfo,
  type DeliveryInfo,
  isValidEmail,
  isValidPhone,
  isValidVatNumber,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCvc,
  isValidDateOfBirth,
} from '../types';

// Action types
type CheckoutAction =
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'SET_PURCHASER_INFO'; payload: Partial<PurchaserInfo> }
  | { type: 'SET_PAYMENT_INFO'; payload: Partial<PaymentInfo> }
  | { type: 'SET_PLAN_INFO'; payload: Partial<PlanInfo> }
  | { type: 'SET_PARTICIPANT'; payload: { index: number; info: Partial<ParticipantInfo> } }
  | { type: 'SET_COURSE_PARTICIPANT'; payload: { index: number; info: Partial<CourseParticipantInfo> } }
  | { type: 'SET_DELIVERY_INFO'; payload: Partial<DeliveryInfo> }
  | { type: 'SET_AGREED_TO_TERMS'; payload: boolean }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'MARK_STEP_COMPLETE'; payload: CheckoutStepId }
  | { type: 'UPDATE_STEPS'; payload: CheckoutStep[] };

// Reducer
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const newQuantity = Math.max(1, action.payload);
      // Adjust participants array length
      const currentParticipants = [...state.participants];
      while (currentParticipants.length < newQuantity) {
        currentParticipants.push({ fullName: '', email: '', phone: '' });
      }
      while (currentParticipants.length > newQuantity) {
        currentParticipants.pop();
      }
      // Adjust course participants array length
      const currentCourseParticipants = [...state.courseParticipants];
      while (currentCourseParticipants.length < newQuantity) {
        currentCourseParticipants.push({ fullName: '', email: '', phone: '', dateOfBirth: '' });
      }
      while (currentCourseParticipants.length > newQuantity) {
        currentCourseParticipants.pop();
      }
      return {
        ...state,
        quantity: newQuantity,
        participants: currentParticipants,
        courseParticipants: currentCourseParticipants,
      };
    }

    case 'SET_PURCHASER_INFO':
      return {
        ...state,
        purchaserInfo: { ...state.purchaserInfo, ...action.payload },
      };

    case 'SET_PAYMENT_INFO':
      return {
        ...state,
        paymentInfo: { ...state.paymentInfo, ...action.payload },
      };

    case 'SET_PLAN_INFO':
      return {
        ...state,
        planInfo: { ...state.planInfo, ...action.payload },
      };

    case 'SET_PARTICIPANT': {
      const newParticipants = [...state.participants];
      newParticipants[action.payload.index] = {
        ...newParticipants[action.payload.index],
        ...action.payload.info,
      };
      return { ...state, participants: newParticipants };
    }

    case 'SET_COURSE_PARTICIPANT': {
      const newCourseParticipants = [...state.courseParticipants];
      newCourseParticipants[action.payload.index] = {
        ...newCourseParticipants[action.payload.index],
        ...action.payload.info,
      };
      return { ...state, courseParticipants: newCourseParticipants };
    }

    case 'SET_DELIVERY_INFO':
      return {
        ...state,
        deliveryInfo: { ...state.deliveryInfo, ...action.payload },
      };

    case 'SET_AGREED_TO_TERMS':
      return { ...state, agreedToTerms: action.payload };

    case 'GO_TO_STEP':
      return { ...state, currentStepIndex: action.payload };

    case 'MARK_STEP_COMPLETE': {
      const newCompleted = new Set(state.completedSteps);
      newCompleted.add(action.payload);
      return { ...state, completedSteps: newCompleted };
    }

    case 'UPDATE_STEPS':
      return { ...state, steps: action.payload };

    default:
      return state;
  }
}

// Calculate dynamic steps based on cart contents
function calculateSteps(items: CartItem[]): CheckoutStep[] {
  const steps: CheckoutStep[] = [
    { id: 'confirm_cart', label: 'Confirm Cart', number: 1 },
    { id: 'purchaser_info', label: 'Purchaser Information', number: 2 },
    { id: 'payment_info', label: 'Payment Information', number: 3 },
  ];

  let stepNumber = 4;

  // Check for Explorer -> Traveler upgrade (but NOT Duo products)
  const hasExplorerUpgrade = items.some((item) => item.isExplorerUpgrade);
  const hasDuo = items.some((item) =>
    item.type === 'duo_go' || item.type === 'duo_run' || item.type === 'duo_fly'
  );

  if (hasExplorerUpgrade && !hasDuo) {
    steps.push({ id: 'plan_info', label: 'Plan Information', number: stepNumber++ });
  }

  // Check for physical course
  const hasPhysicalCourse = items.some((item) => item.type === 'physical_course');
  if (hasPhysicalCourse) {
    steps.push({ id: 'course_participant_details', label: 'Course Participant Details', number: stepNumber++ });
  }

  // Check for merchandise
  const hasMerchandise = items.some((item) => item.type === 'merchandise');
  if (hasMerchandise) {
    steps.push({ id: 'delivery_info', label: 'Delivery Information', number: stepNumber++ });
  }

  // Check if participant info is needed (for digital plans with quantity-based access)
  const hasDigitalPlan = items.some(
    (item) =>
      item.type === 'digital_plan' ||
      item.type === 'duo_go' ||
      item.type === 'duo_run' ||
      item.type === 'duo_fly' ||
      item.type === 'explorer_upgrade'
  );
  if (hasDigitalPlan && !hasPhysicalCourse) {
    steps.push({ id: 'participant_info', label: 'Participant Information', number: stepNumber++ });
  }

  // Always end with review
  steps.push({ id: 'review', label: 'Review', number: stepNumber });

  return steps;
}

// Create initial state
function createInitialState(items: CartItem[]): CheckoutState {
  const steps = calculateSteps(items);
  const initialQuantity = items.length > 0 ? items[0].quantity : 1;

  return {
    items,
    quantity: initialQuantity,
    purchaserInfo: {
      fullName: '',
      email: '',
      phone: '',
      invoiceType: 'personal',
    },
    paymentInfo: {
      method: 'credit_card',
      cardDetails: {
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
      },
    },
    planInfo: {
      dateOfBirth: '',
    },
    participants: Array.from({ length: initialQuantity }, () => ({
      fullName: '',
      email: '',
      phone: '',
    })),
    courseParticipants: Array.from({ length: initialQuantity }, () => ({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    })),
    deliveryInfo: {
      fullName: '',
      email: '',
      phone: '',
      shippingMethod: 'seven_eleven',
    },
    currentStepIndex: 0,
    steps,
    completedSteps: new Set(),
    agreedToTerms: false,
  };
}

// Context
const CheckoutContext = createContext<CheckoutContextValue | null>(null);

// Provider props
interface CheckoutProviderProps {
  children: ReactNode;
  initialItems: CartItem[];
}

// Provider component
export function CheckoutProvider({ children, initialItems }: CheckoutProviderProps) {
  const [state, dispatch] = useReducer(
    checkoutReducer,
    initialItems,
    createInitialState
  );

  // Navigation
  const goToStep = useCallback((stepId: CheckoutStepId) => {
    const index = state.steps.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      dispatch({ type: 'GO_TO_STEP', payload: index });
    }
  }, [state.steps]);

  const goToNextStep = useCallback(() => {
    if (state.currentStepIndex < state.steps.length - 1) {
      const currentStep = state.steps[state.currentStepIndex];
      dispatch({ type: 'MARK_STEP_COMPLETE', payload: currentStep.id });
      dispatch({ type: 'GO_TO_STEP', payload: state.currentStepIndex + 1 });
    }
  }, [state.currentStepIndex, state.steps]);

  const goToPreviousStep = useCallback(() => {
    if (state.currentStepIndex > 0) {
      dispatch({ type: 'GO_TO_STEP', payload: state.currentStepIndex - 1 });
    }
  }, [state.currentStepIndex]);

  // Data updates
  const setQuantity = useCallback((quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', payload: quantity });
  }, []);

  const setPurchaserInfo = useCallback((info: Partial<PurchaserInfo>) => {
    dispatch({ type: 'SET_PURCHASER_INFO', payload: info });
  }, []);

  const setPaymentInfo = useCallback((info: Partial<PaymentInfo>) => {
    dispatch({ type: 'SET_PAYMENT_INFO', payload: info });
  }, []);

  const setPlanInfo = useCallback((info: Partial<PlanInfo>) => {
    dispatch({ type: 'SET_PLAN_INFO', payload: info });
  }, []);

  const setParticipant = useCallback((index: number, info: Partial<ParticipantInfo>) => {
    dispatch({ type: 'SET_PARTICIPANT', payload: { index, info } });
  }, []);

  const setCourseParticipant = useCallback((index: number, info: Partial<CourseParticipantInfo>) => {
    dispatch({ type: 'SET_COURSE_PARTICIPANT', payload: { index, info } });
  }, []);

  const setDeliveryInfo = useCallback((info: Partial<DeliveryInfo>) => {
    dispatch({ type: 'SET_DELIVERY_INFO', payload: info });
  }, []);

  const setAgreedToTerms = useCallback((agreed: boolean) => {
    dispatch({ type: 'SET_AGREED_TO_TERMS', payload: agreed });
  }, []);

  // Utilities
  const usePurchaserInfoForParticipant = useCallback((index: number) => {
    dispatch({
      type: 'SET_PARTICIPANT',
      payload: {
        index,
        info: {
          fullName: state.purchaserInfo.fullName,
          email: state.purchaserInfo.email,
          phone: state.purchaserInfo.phone,
        },
      },
    });
  }, [state.purchaserInfo]);

  const usePurchaserInfoForCourseParticipant = useCallback((index: number) => {
    dispatch({
      type: 'SET_COURSE_PARTICIPANT',
      payload: {
        index,
        info: {
          fullName: state.purchaserInfo.fullName,
          email: state.purchaserInfo.email,
          phone: state.purchaserInfo.phone,
          // DOB intentionally NOT copied
        },
      },
    });
  }, [state.purchaserInfo]);

  const usePurchaserInfoForDelivery = useCallback(() => {
    dispatch({
      type: 'SET_DELIVERY_INFO',
      payload: {
        fullName: state.purchaserInfo.fullName,
        email: state.purchaserInfo.email,
        phone: state.purchaserInfo.phone,
      },
    });
  }, [state.purchaserInfo]);

  // Validation
  const isCurrentStepValid = useCallback((): boolean => {
    const currentStep = state.steps[state.currentStepIndex];
    if (!currentStep) return false;

    switch (currentStep.id) {
      case 'confirm_cart':
        return state.quantity >= 1;

      case 'purchaser_info': {
        const { fullName, email, phone, invoiceType, companyVatNumber, companyName } = state.purchaserInfo;
        const baseValid = fullName.trim() !== '' && isValidEmail(email) && isValidPhone(phone);
        if (invoiceType === 'company') {
          return baseValid && isValidVatNumber(companyVatNumber || '') && (companyName?.trim() || '') !== '';
        }
        return baseValid;
      }

      case 'payment_info': {
        const { method, cardDetails } = state.paymentInfo;
        if (method === 'atm_transfer') return true;
        if (method === 'credit_card' && cardDetails) {
          return (
            cardDetails.cardholderName.trim() !== '' &&
            isValidCardNumber(cardDetails.cardNumber) &&
            isValidExpiryDate(cardDetails.expiryDate) &&
            isValidCvc(cardDetails.cvc)
          );
        }
        return false;
      }

      case 'plan_info':
        return isValidDateOfBirth(state.planInfo.dateOfBirth);

      case 'course_participant_details':
        return state.courseParticipants.every(
          (p) =>
            p.fullName.trim() !== '' &&
            isValidEmail(p.email) &&
            isValidPhone(p.phone) &&
            isValidDateOfBirth(p.dateOfBirth)
        );

      case 'delivery_info': {
        const { fullName, email, phone, storeId } = state.deliveryInfo;
        return fullName.trim() !== '' && isValidEmail(email) && isValidPhone(phone) && !!storeId;
      }

      case 'participant_info':
        return state.participants.every(
          (p) => p.fullName.trim() !== '' && isValidEmail(p.email) && isValidPhone(p.phone)
        );

      case 'review':
        return state.agreedToTerms;

      default:
        return false;
    }
  }, [state]);

  const markStepComplete = useCallback((stepId: CheckoutStepId) => {
    dispatch({ type: 'MARK_STEP_COMPLETE', payload: stepId });
  }, []);

  // Cart helpers
  const getUnitPrice = useCallback((): number => {
    if (state.items.length === 0) return 0;
    return state.items[0].price;
  }, [state.items]);

  const getTotalPrice = useCallback((): number => {
    return getUnitPrice() * state.quantity;
  }, [getUnitPrice, state.quantity]);

  // Step helpers
  const getCurrentStep = useCallback((): CheckoutStep | undefined => {
    return state.steps[state.currentStepIndex];
  }, [state.steps, state.currentStepIndex]);

  const isFirstStep = useCallback((): boolean => {
    return state.currentStepIndex === 0;
  }, [state.currentStepIndex]);

  const isLastStep = useCallback((): boolean => {
    return state.currentStepIndex === state.steps.length - 1;
  }, [state.currentStepIndex, state.steps.length]);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      state,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      setQuantity,
      setPurchaserInfo,
      setPaymentInfo,
      setPlanInfo,
      setParticipant,
      setCourseParticipant,
      setDeliveryInfo,
      setAgreedToTerms,
      usePurchaserInfoForParticipant,
      usePurchaserInfoForCourseParticipant,
      usePurchaserInfoForDelivery,
      isCurrentStepValid,
      markStepComplete,
      getTotalPrice,
      getUnitPrice,
      getCurrentStep,
      isFirstStep,
      isLastStep,
    }),
    [
      state,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      setQuantity,
      setPurchaserInfo,
      setPaymentInfo,
      setPlanInfo,
      setParticipant,
      setCourseParticipant,
      setDeliveryInfo,
      setAgreedToTerms,
      usePurchaserInfoForParticipant,
      usePurchaserInfoForCourseParticipant,
      usePurchaserInfoForDelivery,
      isCurrentStepValid,
      markStepComplete,
      getTotalPrice,
      getUnitPrice,
      getCurrentStep,
      isFirstStep,
      isLastStep,
    ]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

// Hook
export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
