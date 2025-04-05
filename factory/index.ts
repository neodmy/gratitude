import { api } from 'encore.dev/api';

import { TranslatedMessage } from '../slack-adapter/parsers/types';
import { formatMessage } from './parsers';

export const processMessage = api(
  { method: 'POST' },
  async (params: { message: TranslatedMessage }) => {
    const enrichedMessage = await formatMessage(params.message);

    return enrichedMessage;
  }
);
