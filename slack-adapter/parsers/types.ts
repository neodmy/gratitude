export enum SlackMessageType {
  Increase = 'increase',
  Decrease = 'decrease',
}

export type Pattern = {
  userKarma: RegExp;
  reason: RegExp;
  targetUsers: RegExp;
};

export type SlackMessage = {
  type: SlackMessageType;
  text: string;
  user: string;
  team: string;
  channel: string;
  ts: string;
  threadTs?: string;
  appId: string;
};

export type TranslatedMessage = {
  command: SlackMessageType;
  organization: string;
  user: string;
  app: {
    id: string;
  };
  payload: {
    from: string;
    to: string;
    amount: number;
    reason: string;
  };
  origin: {
    name: string;
    channel: string;
    ts: number;
    threadTs: number | null;
  };
};
