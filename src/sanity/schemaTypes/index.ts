import { newsType } from './newsType';
import { newsCategoryType } from './newsCategoryType';
import { careerType } from './careerType';
import { careerTeamType } from './careerTeamType';
import { careerLocationType } from './careerLocationType';

// Sanity now only stores dynamic content:
// - News posts
// - News categories
// - Career positions
// - Career teams (pillars/subgroups)
// - Career locations
export const schemaTypes = [newsType, newsCategoryType, careerTeamType, careerLocationType, careerType];
