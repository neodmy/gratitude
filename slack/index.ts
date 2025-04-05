import { api } from 'encore.dev/api';

import { callSlackAPI } from './utils';
import { SlackUserInfo } from './types';

export const postChatMessage = api(
  { method: 'POST' },
  async (params: { channel: string; text: string }) => {
    return callSlackAPI('chat.postMessage', params);
  }
);

export const getUser = api(
  { method: 'GET' },
  async (params: { user: string }): Promise<SlackUserInfo> => {
    return callSlackAPI('users.info', params);
  }
);
