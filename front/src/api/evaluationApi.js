import { post } from './client';

export const analyzeConversation = (history) =>
  post('/evaluation/analyze', { history });
