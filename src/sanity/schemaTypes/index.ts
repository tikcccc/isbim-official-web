import { newsType } from './newsType';
import { newsCategoryType } from './newsCategoryType';
import { careerType } from './careerType';
import { careerTeamType } from './careerTeamType';
import { careerLocationType } from './careerLocationType';
import { careerPillarType } from './careerPillarType';
import { applicationSettingsType } from './applicationSettingsType';

// Sanity now only stores dynamic content:
// - News posts
// - News categories
// - Career positions
// - Career teams (pillars/subgroups)
// - Career locations
// - Career pillars
// - Global application URL
export const schemaTypes = [
  newsType,
  newsCategoryType,
  careerPillarType,
  careerTeamType,
  careerLocationType,
  applicationSettingsType,
  careerType,
];
