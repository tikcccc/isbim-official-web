import type { Career } from "@/sanity/lib/types";

export const formatDate = (value?: string | null, locale: string = "en-US") => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

export const formatWorkModel = (value?: Career["workModel"]) => {
  switch (value) {
    case "onsite":
      return "On-site";
    case "hybrid":
      return "Hybrid";
    case "remote":
      return "Remote";
    default:
      return null;
  }
};

export const formatEmploymentType = (value?: Career["employmentType"]) => {
  switch (value) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    case "temporary":
      return "Temporary";
    default:
      return null;
  }
};

export const formatExperience = (value?: Career["experienceLevel"]) => {
  switch (value) {
    case "intern":
      return "Intern";
    case "junior":
      return "Junior";
    case "mid":
      return "Mid-level";
    case "senior":
      return "Senior";
    case "lead":
      return "Lead";
    case "director":
      return "Director";
    default:
      return null;
  }
};

