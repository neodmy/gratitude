import { secret } from 'encore.dev/config';

const slackBotToken = secret('BotToken');

export const callSlackAPI = async <T, K>(
  endpoint: string,
  body: K
): Promise<T> => {
  const response = await fetch(`https://slack.com/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${slackBotToken()}`,
    },
    body: JSON.stringify(body),
  });

  return (await response.json()) as T;
};
