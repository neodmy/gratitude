export type SlackData = {
  from: string;
  to: string;
  channel: string;
  organization: string;
};

export type EnrichedMessage = {
  command: string;
  user: {
    id: string;
    email: string;
  };
  payload: {
    from: {
      id: string;
      email: string;
    };
    to: {
      id: string;
      email: string;
    };
    amount: number;
    reason: string;
  };
  origin: {
    name: string;
    channel: {
      id: string;
      name: string;
    };
    ts: number;
    threadTs: number | null;
  };
  organization: {
    id: string;
    name: string;
  };
  app: {
    id: string;
  };
};
