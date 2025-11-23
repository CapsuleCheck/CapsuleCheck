import { useMemo } from "react";
import { useAppData } from "@/context/AppDataContext";
import { useUser } from "@/context/UserContext";
import { Prescription, Medication, Prescriber, Appointment, Notification } from "@/types/data";

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function usePrescriptions() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.prescriptions,
    active: state.prescriptions.filter((p) => p.status === "active"),
    needingRefill: state.prescriptions.filter((p) => p.status === "pending_refill"),
    expired: state.prescriptions.filter((p) => p.status === "expired"),
    getById: (id: string) => state.prescriptions.find((p) => p.id === id),
  }), [state.prescriptions]);
}

export function useMedications() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.medications,
    getById: (id: string) => state.medications.find((m) => m.id === id),
    search: (query: string) =>
      state.medications.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.genericName?.toLowerCase().includes(query.toLowerCase())
      ),
  }), [state.medications]);
}

export function useMedicationPrices() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.medicationPrices,
    getByMedicationId: (medicationId: string) =>
      state.medicationPrices.find((mp) => mp.medicationId === medicationId),
    search: (query: string) =>
      state.medicationPrices.filter((mp) =>
        mp.medication.name.toLowerCase().includes(query.toLowerCase()) ||
        mp.medication.genericName?.toLowerCase().includes(query.toLowerCase())
      ),
    sortedByPrice: () =>
      [...state.medicationPrices].sort((a, b) => a.lowestPrice - b.lowestPrice),
  }), [state.medicationPrices]);
}

export function usePrescribers() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.prescribers,
    available: state.prescribers.filter((p) => p.acceptingNewPatients),
    getById: (id: string) => state.prescribers.find((p) => p.id === id),
    search: (query: string) =>
      state.prescribers.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialty.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      ),
    sortedByRating: () =>
      [...state.prescribers].sort((a, b) => b.rating - a.rating),
  }), [state.prescribers]);
}

export function useReviews() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.reviews,
    getByPrescriberId: (prescriberId: string) =>
      state.reviews.filter((r) => r.prescriberId === prescriberId),
    verified: state.reviews.filter((r) => r.verified),
  }), [state.reviews]);
}

export function useAppointments() {
  const { state } = useAppData();
  const { userRole } = useUser();
  
  return useMemo(() => ({
    all: state.appointments,
    upcoming: state.appointments.filter(
      (a) => a.status === "scheduled" && new Date(a.date) >= new Date()
    ),
    past: state.appointments.filter(
      (a) => a.status === "completed" || new Date(a.date) < new Date()
    ),
    getById: (id: string) => state.appointments.find((a) => a.id === id),
    today: state.appointments.filter(
      (a) => a.status === "scheduled" && isToday(new Date(a.date))
    ),
  }), [state.appointments, userRole]);
}

export function useNotifications() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.notifications,
    unread: state.notifications.filter((n) => !n.read),
    read: state.notifications.filter((n) => n.read),
    unreadCount: state.notifications.filter((n) => !n.read).length,
    getById: (id: string) => state.notifications.find((n) => n.id === id),
  }), [state.notifications]);
}

export function useAIAnalyses() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.aiAnalyses,
    getById: (id: string) => state.aiAnalyses.find((a) => a.id === id),
    getByPrescriptionId: (prescriptionId: string) =>
      state.aiAnalyses.find((a) => a.prescriptionId === prescriptionId),
  }), [state.aiAnalyses]);
}

export function useUserProfile() {
  const { state } = useAppData();
  return state.userProfile;
}

export function usePaymentMethods() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.paymentMethods,
    default: state.paymentMethods.find((pm) => pm.isDefault),
    getById: (id: string) => state.paymentMethods.find((pm) => pm.id === id),
  }), [state.paymentMethods]);
}

export function useNotificationPreferences() {
  const { state } = useAppData();
  return state.notificationPreferences;
}

export function useRefillRequests() {
  const { state } = useAppData();
  
  return useMemo(() => ({
    all: state.refillRequests,
    pending: state.refillRequests.filter((rr) => rr.status === "pending"),
    getByPrescriptionId: (prescriptionId: string) =>
      state.refillRequests.filter((rr) => rr.prescriptionId === prescriptionId),
  }), [state.refillRequests]);
}
