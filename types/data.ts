export type PrescriptionStatus =
  | "active"
  | "pending_refill"
  | "refill_requested"
  | "expired"
  | "cancelled";

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType = "video_call" | "in_person" | "phone_call";

export type MedicationType =
  | "tablet"
  | "capsule"
  | "liquid"
  | "injection"
  | "cream"
  | "inhaler";

export type NotificationType =
  | "refill_reminder"
  | "appointment_reminder"
  | "price_alert"
  | "prescription_ready"
  | "appointment_confirmed"
  | "general";

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  type: MedicationType;
  description?: string;
  sideEffects?: string[];
  uses?: string[];
}

export interface PriceSource {
  id: string;
  pharmacyName: string;
  price: number;
  distance?: number;
  inStock: boolean;
  pharmacyId?: string;
  isGenericOffer?: boolean;
  patientRating?: number;
}

export interface MedicationPrice {
  medicationId: string;
  medication: Medication;
  supply: string;
  sources: PriceSource[];
  lowestPrice: number;
  averagePrice: number;
}

export interface Prescription {
  id: string;
  medicationId: string;
  medication: Medication;
  prescriberId: string;
  prescriberName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refillsRemaining: number;
  totalRefills: number;
  status: PrescriptionStatus;
  dateIssued: string;
  expirationDate: string;
  lastRefillDate?: string;
  nextRefillDate?: string;
  instructions?: string;
  analysisId?: string;
}

export interface RefillRequest {
  id: string;
  prescriptionId: string;
  pharmacyId: string;
  pharmacyName: string;
  deliveryAddress: string;
  notes?: string;
  requestedDate: string;
  status: "pending" | "processing" | "ready" | "delivered" | "cancelled";
}

export interface Prescriber {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  licenseNumber?: string;
  yearsExperience: number;
  bio?: string;
  education?: string[];
  languages?: string[];
  acceptingNewPatients: boolean;
  availableDays: string[];
  consultationFee?: number;
}

export interface Review {
  id: string;
  prescriberId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Appointment {
  id: string;
  prescriberId: string;
  prescriberName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  address?: string;
  reason?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionable: boolean;
  actionText?: string;
  actionLink?: string;
  relatedId?: string;
}

export interface AIAnalysisResult {
  id: string;
  prescriptionId?: string;
  imageUri?: string;
  documentUri?: string;
  analyzedDate: string;
  detectedMedications: {
    name: string;
    dosage: string;
    confidence: number;
  }[];
  recommendations: {
    alternative: string;
    reason: string;
    potentialSavings: number;
  }[];
  warnings: string[];
  interactions: string[];
  summary: string;
  priceInsights: {
    averagePrice: number;
    lowestPrice: number;
    potentialSavings: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  dateOfBirth: string;
  insuranceProvider?: string;
  insuranceMemberId?: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "bank_account";
  lastFour: string;
  expiryDate?: string;
  cardholderName?: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  refillReminders: boolean;
  appointmentReminders: boolean;
  priceAlerts: boolean;
  promotions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
