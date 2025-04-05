import { api } from 'encore.dev/api';
import { slack } from '~encore/clients';

export const sendMessageToChannel = api(
  { method: 'POST' },
  async (params: { channel: string; text: string }) => {
    return slack.postChatMessage(params);
  }
);
