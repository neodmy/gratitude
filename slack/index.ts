import { api } from 'encore.dev/api';
import { secret } from 'encore.dev/config';

import {
  SlackUserInfo,
  SlackChannelResponse,
  SlackOrganizationResponse,
  SlackGroupMembersResponse,
} from './types';

const slackBotToken = secret('BotToken');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${slackBotToken()}`,
};

export const postChatMessage = api(
  { method: 'POST' },
  async (params: { channel: string; text: string }) => {
    const response = await fetch(`https://slack.com/api/chat.postMessage`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    const data = await response.json();

    return data;
  }
);

export const getUser = api(
  { method: 'GET' },
  async (params: { user: string }): Promise<SlackUserInfo['user']> => {
    const response = await fetch(
      `https://slack.com/api/users.info?user=${params.user}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = (await response.json()) as SlackUserInfo;

    if (!data.ok) {
      throw new Error('Failed to get user info');
    }

    return data.user;
  }
);

export const getChannelById = api(
  { method: 'GET' },
  async (params: {
    channel: string;
  }): Promise<SlackChannelResponse['channel']> => {
    const response = await fetch(
      `https://slack.com/api/conversations.info?channel=${params.channel}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = (await response.json()) as SlackChannelResponse;

    console.log(data);
    if (!data.ok) {
      throw new Error('Failed to get channel info');
    }

    return data.channel;
  }
);

export const getOrganizationById = api(
  { method: 'GET' },
  async (params: {
    organization: string;
  }): Promise<SlackOrganizationResponse['team']> => {
    const response = await fetch(
      `https://slack.com/api/team.info?team=${params.organization}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = (await response.json()) as SlackOrganizationResponse;

    if (!data.ok) {
      throw new Error('Failed to get organization info');
    }

    return data.team;
  }
);

export const getUsersInGroup = api(
  { method: 'GET' },
  async (params: {
    group: string;
  }): Promise<{ users: SlackGroupMembersResponse['users'] }> => {
    const response = await fetch(
      `https://slack.com/api/usergroups.users.list?usergroup=${params.group}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = (await response.json()) as SlackGroupMembersResponse;

    if (!data.ok) {
      throw new Error('Failed to get users in group');
    }

    return { users: data.users };
  }
);
