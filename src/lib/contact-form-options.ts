export const CONTACT_SERVICE_VALUES = [
  "BIM Consultancy",
  "AI Solutions",
  "Software Training",
  "3D Modeling",
  "jarvis-desktop",
  "jarvis-cloud",
  "support",
  "other",
] as const;

export type ContactServiceValue = (typeof CONTACT_SERVICE_VALUES)[number];

export const CONTACT_SERVICE_TITLES: Record<ContactServiceValue, string> = {
  "BIM Consultancy": "BIM Consultancy",
  "AI Solutions": "AI Construction Solutions",
  "Software Training": "Software Training",
  "3D Modeling": "3D Modeling & Coordination",
  "jarvis-desktop": "JARVIS Desktop",
  "jarvis-cloud": "JARVIS Cloud",
  support: "Technical Support",
  other: "Other",
};

export const CONTACT_COMPANY_TYPE_VALUES = [
  "Architectural",
  "Engineering",
  "Contractor",
  "Developer",
  "Government",
  "IT",
  "Other",
] as const;

export type ContactCompanyTypeValue =
  (typeof CONTACT_COMPANY_TYPE_VALUES)[number];

export const CONTACT_COMPANY_TYPE_TITLES: Record<
  ContactCompanyTypeValue,
  string
> = {
  Architectural: "Architectural Firm",
  Engineering: "Engineering Consultant",
  Contractor: "Main Contractor",
  Developer: "Property Developer",
  Government: "Government / Public Sector",
  IT: "IT Company",
  Other: "Other",
};

export function getContactServiceTitle(value: string): string {
  return CONTACT_SERVICE_TITLES[value as ContactServiceValue] || value;
}

export function getContactCompanyTypeTitle(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return (
    CONTACT_COMPANY_TYPE_TITLES[value as ContactCompanyTypeValue] || value
  );
}
