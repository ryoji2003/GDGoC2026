import { get, post } from './client';

export const saveRecord = (userId, scenarioName, scores, feedback) =>
  post('/records/', {
    user_id: userId,
    scenario_name: scenarioName,
    scores,
    feedback,
    created_at: new Date().toISOString(),
  });

export const getRecords = (userId) => get(`/records/${userId}`).then(res => res.records);
