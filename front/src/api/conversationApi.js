import { post } from './client';

export const sendMessage = (sessionId, scenarioName, message) =>
  post('/conversation/message', { session_id: sessionId, scenario_name: scenarioName, message });

export const endSession = (sessionId) =>
  post('/conversation/end', { session_id: sessionId });
