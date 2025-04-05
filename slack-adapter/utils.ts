import { IncomingHttpHeaders } from 'http';
import { IncomingMessage } from 'http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { secret } from 'encore.dev/config';

import { SlackMessageType } from './parsers/types';

const slackSigningSecret = secret('SlackSigningSecret');

// Verifies the signature of an incoming request from Slack.
// https://github.com/slackapi/bolt-js/blob/main/src/receivers/verify-request.ts
export const verifySignature = async function (
  body: string,
  headers: IncomingHttpHeaders
) {
  const requestTimestampSec = parseInt(
    headers['x-slack-request-timestamp'] as string
  );
  const signature = headers['x-slack-signature'] as string;
  if (Number.isNaN(requestTimestampSec)) {
    throw new Error(
      `Failed to verify authenticity: header x-slack-request-timestamp did not have the expected type (${requestTimestampSec})`
    );
  }

  // Calculate time-dependent values
  const nowMs = Date.now();
  const requestTimestampMaxDeltaMin = 5;
  const fiveMinutesAgoSec =
    Math.floor(nowMs / 1000) - 60 * requestTimestampMaxDeltaMin;

  // Enforce verification rules

  // Rule 1: Check staleness
  if (requestTimestampSec < fiveMinutesAgoSec) {
    throw new Error(
      `Failed to verify authenticity: x-slack-request-timestamp must differ from system time by no more than ${requestTimestampMaxDeltaMin} minutes or request is stale`
    );
  }

  // Rule 2: Check signature
  // Separate parts of signature
  const [signatureVersion, signatureHash] = signature.split('=');
  // Only handle known versions
  if (signatureVersion !== 'v0') {
    throw new Error(`Failed to verify authenticity: unknown signature version`);
  }
  // Compute our own signature hash
  const hmac = createHmac('sha256', slackSigningSecret());
  hmac.update(`${signatureVersion}:${requestTimestampSec}:${body}`);
  const ourSignatureHash = hmac.digest('hex');
  if (
    !signatureHash ||
    !timingSafeEqual(
      Buffer.from(signatureHash, 'utf8'),
      Buffer.from(ourSignatureHash, 'utf8')
    )
  ) {
    throw new Error(`Failed to verify authenticity: signature mismatch`);
  }
};

export const getBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve) => {
    const bodyParts: any[] = [];
    req
      .on('data', (chunk) => {
        bodyParts.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(bodyParts).toString());
      });
  });
};

export const getSlackMessageType = (text: string): SlackMessageType | null => {
  if (text.includes('++')) {
    return SlackMessageType.Increase;
  } else if (text.includes('--')) {
    return SlackMessageType.Decrease;
  }
  return null;
};
