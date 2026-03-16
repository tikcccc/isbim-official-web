import { newsType } from './newsType';
import { newsCategoryType } from './newsCategoryType';
import { caseStudyType } from './caseStudyType';
import { caseStudyCategoryType } from './caseStudyCategoryType';
import { careerType } from './careerType';
import { careerTeamType } from './careerTeamType';
import { careerLocationType } from './careerLocationType';
import { careerPillarType } from './careerPillarType';
import { applicationSettingsType } from './applicationSettingsType';
import { contactFormSubmissionType } from "./contactFormSubmissionType";

// Sanity now only stores dynamic content:
// - News posts
// - News categories
// - Case studies
// - Case study categories
// - Career positions
// - Career teams (pillars/subgroups)
// - Career locations
// - Career pillars
// - Global application URL
// - Contact form submissions
export const schemaTypes = [
  newsType,
  newsCategoryType,
  caseStudyType,
  caseStudyCategoryType,
  careerPillarType,
  careerTeamType,
  careerLocationType,
  applicationSettingsType,
  careerType,
  contactFormSubmissionType,
];
