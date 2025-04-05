import { api } from 'encore.dev/api';
import { secret } from 'encore.dev/config';

const botId = secret('SlackBotId');

import { SlackPayload, SlackEventType } from './types';
import { getBody, getSlackMessageType, verifySignature } from './utils';
import { translateMessage } from './parsers';

export const slackEvent = api.raw(
  { expose: true, path: '/', method: 'POST' },
  async (req, resp) => {
    const body = await getBody(req);

    try {
      await verifySignature(body, req.headers);
    } catch (error) {
      console.error('Error verifying signature:', error);
      resp.statusCode = 401;
      resp.end('Unauthorized');
      return;
    }

    try {
      const data = JSON.parse(body) as SlackPayload;
      if (data.type === SlackEventType.UrlVerification) {
        return resp.end(data.challenge);
      }

      if (
        data.type === SlackEventType.EventCallback &&
        data.event.bot_id !== botId()
      ) {
        const messageType = getSlackMessageType(data.event.text);
        if (messageType) {
          const translatedMessages = translateMessage({
            type: messageType,
            text: data.event.text,
            user: data.event.user,
            team: data.event.team,
            channel: data.event.channel,
            ts: data.event.ts,
            threadTs: data.event.thread_ts,
            appId: data.api_app_id,
          });

          // TODO: process translated messages
        }
      }

      return resp.end();
    } catch (error) {
      console.error('Endpoint error:', error);
      resp.statusCode = 500;
      resp.end('Internal server error');
    }
  }
);
