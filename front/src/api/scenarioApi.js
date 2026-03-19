import { get } from './client';

export const getScenarios = () => get('/scenarios/').then(res => res.scenarios);
