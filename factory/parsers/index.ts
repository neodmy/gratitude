import { slack } from '~encore/clients';
import { clone } from 'ramda';

import { TranslatedMessage } from '../../slack-adapter/parsers/types';
import { SlackData, EnrichedMessage } from './types';

const getSlackData = async (message: TranslatedMessage): Promise<SlackData> => {
  const [from, to, channel, organization] = await Promise.all([
    slack.getUser({ user: message.payload.from }),
    slack.getUser({ user: message.payload.to }),
    slack.getChannelById({ channel: message.origin.channel }),
    slack.getOrganizationById({ organization: message.organization }),
  ]);

  return {
    from: from.profile.email,
    to: to.profile.email,
    channel: channel.name,
    organization: organization.name,
  };
};

const isMessageForGroup = (message: TranslatedMessage) => {
  const toUser = message.payload.to;
  return /^S\w+/.test(toUser);
};

const generateUsersFromGroup = async (message: TranslatedMessage) => {
  const group = message.payload.to;
  const { users } = await slack.getUsersInGroup({ group });

  return users.map((userId) => {
    const clonedMessage = clone(message);
    clonedMessage.payload.to = userId;
    return clonedMessage;
  });
};

const enrichMessage = async (
  message: TranslatedMessage
): Promise<EnrichedMessage> => {
  const slackData = await getSlackData(message);
  return {
    command: message.command,
    user: {
      id: message.user,
      email: slackData.from,
    },
    payload: {
      from: {
        id: message.user,
        email: slackData.from,
      },
      to: {
        id: message.payload.to,
        email: slackData.to,
      },
      amount: message.payload.amount,
      reason: message.payload.reason,
    },
    origin: {
      name: message.origin.name,
      channel: {
        id: message.origin.channel,
        name: slackData.channel,
      },
      ts: message.origin.ts,
      threadTs: message.origin.threadTs,
    },
    organization: {
      id: message.organization,
      name: slackData.organization,
    },
    app: message.app,
  };
};

export const formatMessage = async (message: TranslatedMessage) => {
  const messages = [];
  if (isMessageForGroup(message)) {
    const groupMessages = await generateUsersFromGroup(message);
    messages.push(...groupMessages);
  } else {
    messages.push(message);
  }

  const enrichedMessages = await Promise.all(messages.map(enrichMessage));

  return enrichedMessages;
};
