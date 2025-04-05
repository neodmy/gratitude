import { match, map } from 'ramda';

import {
  SlackMessage,
  TranslatedMessage,
  Pattern,
  SlackMessageType,
} from './types';

const patterns: Record<SlackMessageType, Pattern> = {
  increase: {
    userKarma: /(?:<@|<!subteam\^)(\w+)(?:\|@\S+)?>\s*(\+{1,})/,
    reason: /(<@\w+>|<!subteam\^\w+\|@\S+>)\s*\+{1,}/,
    targetUsers:
      /(<@\w+>|<!subteam\^\w+(\|@\S+)?>)\s*\+(\+)+((?!(\x3C\x40|\x3C!))[\S|\s])*(^<)?/g,
  },
  decrease: {
    userKarma: /(?:<@|<!subteam\^)(\w+)(?:\|@\S+)?>\s*(-{1,})/,
    reason: /(<@\w+>|<!subteam\^\w+\|@\S+>)\s*-{1,}/,
    targetUsers:
      /(<@\w+>|<!subteam\^\w+(\|@\S+)?>)\s*-(-)+((?!(\x3C\x40|\x3C!))[\S|\s])*(^<)?/g,
  },
};

export const translateMessage = ({
  type,
  text = '',
  user,
  team,
  channel,
  ts,
  threadTs,
  appId,
}: SlackMessage): TranslatedMessage[] => {
  const pattern = patterns[type];

  const translateUser = (userKarma: string) => {
    const [, targetUser, karma] = match(pattern.userKarma, userKarma);
    const reason = userKarma.replace(pattern.reason, '').trim();
    return {
      command: type,
      organization: team,
      user,
      app: {
        id: appId,
      },
      payload: {
        from: user,
        to: targetUser,
        amount: karma.length - 1,
        reason,
      },
      origin: {
        name: 'slack',
        channel,
        ts: parseFloat(ts),
        threadTs: threadTs ? parseFloat(threadTs) : null,
      },
    };
  };
  const targetUsers = match(pattern.targetUsers, text);
  return map(translateUser, targetUsers);
};
