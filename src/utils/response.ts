import { createResponse } from 'itty-router';

export const response = {
  rss: createResponse('application/rss+xml; charset=utf-8'),
  atom: createResponse('application/atom+xml; charset=utf-8'),
  json: createResponse('application/json; charset=utf-8'),
};
