import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Prescription,
  Medication,
  MedicationPrice,
  Prescriber,
  Review,
  Appointment,
  Notification,
  AIAnalysisResult,
  PaymentMethod,
  NotificationPreferences,
  RefillRequest,
  PrescriberProfile,
} from "@/types/data";
import {
  SEED_MEDICATIONS,
  SEED_MEDICATION_PRICES,
  SEED_PRESCRIPTIONS,
  SEED_PRESCRIBERS,
  SEED_REVIEWS,
  SEED_APPOINTMENTS,
  SEED_NOTIFICATIONS,
  SEED_PAYMENT_METHODS,
  SEED_AI_ANALYSES,
} from "@/data/seedData";
import { generateMockAnalysis } from "@/utils/aiAnalysis";

interface AppDataState {
  prescriptions: Prescription[];
  medications: Medication[];
  medicationPrices: MedicationPrice[];
  prescribers: Prescriber[];
  reviews: Review[];
  appointments: Appointment[];
  notifications: Notification[];
  aiAnalyses: AIAnalysisResult[];
  prescriberProfile: PrescriberProfile | null;
  paymentMethods: PaymentMethod[];
  notificationPreferences: NotificationPreferences;
  refillRequests: RefillRequest[];
}

type AppDataAction =
  | { type: "CREATE_PRESCRIPTION"; payload: Prescription }
  | {
      type: "UPDATE_PRESCRIPTION";
      payload: { id: string; updates: Partial<Prescription> };
    }
  | { type: "DELETE_PRESCRIPTION"; payload: string }
  | { type: "CREATE_APPOINTMENT"; payload: Appointment }
  | {
      type: "UPDATE_APPOINTMENT";
      payload: { id: string; updates: Partial<Appointment> };
    }
  | { type: "CANCEL_APPOINTMENT"; payload: string }
  | { type: "CREATE_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "CREATE_AI_ANALYSIS"; payload: AIAnalysisResult }
  | { type: "SET_PRESCRIBER_PROFILE"; payload: PrescriberProfile }
  | { type: "UPDATE_PRESCRIBER_PROFILE"; payload: Partial<PrescriberProfile> }
  | { type: "ADD_PAYMENT_METHOD"; payload: PaymentMethod }
  | {
      type: "UPDATE_PAYMENT_METHOD";
      payload: { id: string; updates: Partial<PaymentMethod> };
    }
  | { type: "DELETE_PAYMENT_METHOD"; payload: string }
  | {
      type: "UPDATE_NOTIFICATION_PREFERENCES";
      payload: Partial<NotificationPreferences>;
    }
  | { type: "CREATE_REFILL_REQUEST"; payload: RefillRequest }
  | {
      type: "UPDATE_REFILL_REQUEST";
      payload: { id: string; updates: Partial<RefillRequest> };
    }
  | { type: "ADD_REVIEW"; payload: Review }
  | { type: "RESET_DATA" };

interface AppDataContextType {
  state: AppDataState;
  dispatch: React.Dispatch<AppDataAction>;
  createPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  createAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  createNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  createAIAnalysis: (analysis: AIAnalysisResult) => void;
  setPrescriberProfile: (profile: PrescriberProfile) => void;
  updatePrescriberProfile: (updates: Partial<PrescriberProfile>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  updateNotificationPreferences: (
    preferences: Partial<NotificationPreferences>
  ) => void;
  createRefillRequest: (request: RefillRequest) => void;
  updateRefillRequest: (id: string, updates: Partial<RefillRequest>) => void;
  addReview: (review: Review) => void;
  createPrescriptionAnalysis: (prescriptionId: string) => Promise<string>;
  resetData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialState: AppDataState = {
  prescriptions: [],
  medications: [],
  medicationPrices: [],
  prescribers: [],
  reviews: [],
  appointments: [],
  notifications: [],
  aiAnalyses: [],
  prescriberProfile: null,
  paymentMethods: [],
  notificationPreferences: {
    refillReminders: true,
    appointmentReminders: true,
    priceAlerts: true,
    promotions: false,
    emailNotifications: true,
    pushNotifications: true,
  },
  refillRequests: [],
};

function appDataReducer(
  state: AppDataState,
  action: AppDataAction
): AppDataState {
  switch (action.type) {
    case "CREATE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: [...state.prescriptions, action.payload],
      };

    case "UPDATE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case "DELETE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.filter(
          (p) => p.id !== action.payload
        ),
      };

    case "CREATE_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };

    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case "CANCEL_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload ? { ...a, status: "cancelled" as const } : a
        ),
      };

    case "CREATE_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case "CREATE_AI_ANALYSIS":
      return {
        ...state,
        aiAnalyses: [...state.aiAnalyses, action.payload],
      };

    case "SET_PRESCRIBER_PROFILE":
      return {
        ...state,
        prescriberProfile: action.payload,
      };

    case "UPDATE_PRESCRIBER_PROFILE":
      return {
        ...state,
        prescriberProfile: state.prescriberProfile
          ? { ...state.prescriberProfile, ...action.payload }
          : null,
      };

    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      };

    case "UPDATE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: state.paymentMethods.map((pm) =>
          pm.id === action.payload.id
            ? { ...pm, ...action.payload.updates }
            : pm
        ),
      };

    case "DELETE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: state.paymentMethods.filter(
          (pm) => pm.id !== action.payload
        ),
      };

    case "UPDATE_NOTIFICATION_PREFERENCES":
      return {
        ...state,
        notificationPreferences: {
          ...state.notificationPreferences,
          ...action.payload,
        },
      };

    case "CREATE_REFILL_REQUEST":
      return {
        ...state,
        refillRequests: [...state.refillRequests, action.payload],
      };

    case "UPDATE_REFILL_REQUEST":
      return {
        ...state,
        refillRequests: state.refillRequests.map((rr) =>
          rr.id === action.payload.id
            ? { ...rr, ...action.payload.updates }
            : rr
        ),
      };

    case "ADD_REVIEW":
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };

    case "RESET_DATA":
      return initialState;

    default:
      return state;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appDataReducer, {
    ...initialState,
    prescriptions: SEED_PRESCRIPTIONS,
    medications: SEED_MEDICATIONS,
    medicationPrices: SEED_MEDICATION_PRICES,
    prescribers: SEED_PRESCRIBERS,
    reviews: SEED_REVIEWS,
    appointments: SEED_APPOINTMENTS,
    notifications: SEED_NOTIFICATIONS,
    aiAnalyses: SEED_AI_ANALYSES,
    paymentMethods: SEED_PAYMENT_METHODS,
    refillRequests: [],
  });

  const value: AppDataContextType = {
    state,
    dispatch,
    createPrescription: (prescription) =>
      dispatch({ type: "CREATE_PRESCRIPTION", payload: prescription }),
    updatePrescription: (id, updates) =>
      dispatch({ type: "UPDATE_PRESCRIPTION", payload: { id, updates } }),
    deletePrescription: (id) =>
      dispatch({ type: "DELETE_PRESCRIPTION", payload: id }),
    createAppointment: (appointment) =>
      dispatch({ type: "CREATE_APPOINTMENT", payload: appointment }),
    updateAppointment: (id, updates) =>
      dispatch({ type: "UPDATE_APPOINTMENT", payload: { id, updates } }),
    cancelAppointment: (id) =>
      dispatch({ type: "CANCEL_APPOINTMENT", payload: id }),
    createNotification: (notification) =>
      dispatch({ type: "CREATE_NOTIFICATION", payload: notification }),
    markNotificationRead: (id) =>
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
    markAllNotificationsRead: () =>
      dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" }),
    deleteNotification: (id) =>
      dispatch({ type: "DELETE_NOTIFICATION", payload: id }),
    createAIAnalysis: (analysis) =>
      dispatch({ type: "CREATE_AI_ANALYSIS", payload: analysis }),
    setPrescriberProfile: (profile) =>
      dispatch({ type: "SET_PRESCRIBER_PROFILE", payload: profile }),
    updatePrescriberProfile: (updates) =>
      dispatch({ type: "UPDATE_PRESCRIBER_PROFILE", payload: updates }),
    addPaymentMethod: (method) =>
      dispatch({ type: "ADD_PAYMENT_METHOD", payload: method }),
    updatePaymentMethod: (id, updates) =>
      dispatch({ type: "UPDATE_PAYMENT_METHOD", payload: { id, updates } }),
    deletePaymentMethod: (id) =>
      dispatch({ type: "DELETE_PAYMENT_METHOD", payload: id }),
    updateNotificationPreferences: (preferences) =>
      dispatch({
        type: "UPDATE_NOTIFICATION_PREFERENCES",
        payload: preferences,
      }),
    createRefillRequest: (request) =>
      dispatch({ type: "CREATE_REFILL_REQUEST", payload: request }),
    updateRefillRequest: (id, updates) =>
      dispatch({ type: "UPDATE_REFILL_REQUEST", payload: { id, updates } }),
    addReview: (review) => dispatch({ type: "ADD_REVIEW", payload: review }),
    createPrescriptionAnalysis: async (prescriptionId: string) => {
      const prescription = state.prescriptions.find(
        (p) => p.id === prescriptionId
      );
      if (!prescription) {
        throw new Error("Prescription not found");
      }

      if (prescription.analysisId) {
        return prescription.analysisId;
      }

      const analysis = await generateMockAnalysis(
        prescription,
        state.medications,
        state.medicationPrices
      );

      dispatch({ type: "CREATE_AI_ANALYSIS", payload: analysis });
      dispatch({
        type: "UPDATE_PRESCRIPTION",
        payload: { id: prescriptionId, updates: { analysisId: analysis.id } },
      });

      return analysis.id;
    },
    resetData: () => dispatch({ type: "RESET_DATA" }),
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
