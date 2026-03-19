import { post, postForm } from './client';

export const recognizeSpeech = (blob) => {
  const form = new FormData();
  form.append('audio', blob, 'recording.webm');
  return postForm('/speech/recognize', form);
};

export const synthesizeSpeech = (text) => post('/speech/synthesize', { text });
