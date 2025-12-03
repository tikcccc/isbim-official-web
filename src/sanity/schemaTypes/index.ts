import { newsType } from './newsType';
import { newsCategoryType } from './newsCategoryType';
import { careerType } from './careerType';

// Sanity now only stores dynamic content:
// - News posts
// - News categories
// - Career positions
export const schemaTypes = [newsType, newsCategoryType, careerType];
