import { UserProfile } from "@/types/data";

const defaultAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};

const defaultEmergencyContact = {
  name: "",
  phone: "",
  relationship: "",
};

/**
 * Maps API / UserContext userData (various shapes) to UserProfile type.
 * Use when you need a consistent display shape (e.g. address, phone) from userData.
 */
export function mapUserDataToProfile(data: any): UserProfile {
  if (!data) {
    return {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: { ...defaultAddress },
      dateOfBirth: "",
      allergies: [],
      conditions: [],
      emergencyContact: { ...defaultEmergencyContact },
    };
  }
  const addr = data.address && typeof data.address === "object"
    ? data.address
    : {};
  const emergency = data.emergencyContact && typeof data.emergencyContact === "object"
    ? data.emergencyContact
    : {};
  return {
    id: data.id ?? data._id ?? "",
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? data.phoneNumber ?? "",
    address: {
      street: addr.street ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      country: addr.country ?? "",
      zip: addr.zip ?? addr.zipCode ?? "",
    },
    dateOfBirth: data.dateOfBirth ?? data.dob ?? "",
    insuranceProvider: data.insuranceProvider,
    insuranceMemberId: data.insuranceMemberId,
    allergies: Array.isArray(data.allergies) ? data.allergies : [],
    conditions: Array.isArray(data.conditions) ? data.conditions : [],
    emergencyContact: {
      name: emergency.name ?? "",
      phone: emergency.phone ?? "",
      relationship: emergency.relationship ?? "",
    },
  };
}
