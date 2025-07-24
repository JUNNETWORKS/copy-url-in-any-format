import type { PageInfo, Format } from '../types';

export function formatUrl(pageInfo: PageInfo, format: Format): string {
  let result = format.template;
  
  // Replace all occurrences of {title} with the actual title
  result = result.replace(/{title}/g, pageInfo.title);
  
  // Replace all occurrences of {url} with the actual URL
  result = result.replace(/{url}/g, pageInfo.url);
  
  return result;
}