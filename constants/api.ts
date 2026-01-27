// API Configuration
// Update this with your backend API base URL
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  patients: "/patients",
  bookings: "/bookings",
  patientUpdate: "/patients/update",
  prescribers: "/prescribers",
  prescriberUpdate: "/prescribers/update",
  prescriberUploadLicense: "/prescribers/upload-license",
  // Add other endpoints here as needed
};
