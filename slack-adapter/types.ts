export enum SlackEventType {
  UrlVerification = 'url_verification',
  EventCallback = 'event_callback',
}

interface SlackUrlVerification {
  token: string;
  challenge: string;
  type: SlackEventType.UrlVerification;
}

interface SlackEventBlock {
  type: string;
  block_id: string;
  elements: {
    type: string;
    elements: {
      type: string;
      text: string;
    }[];
  }[];
}

interface SlackBotProfile {
  id: string;
  deleted: boolean;
  name: string;
  updated: number;
  app_id: string;
  user_id: string;
  icons: Record<string, any>;
  team_id: string;
}

interface SlackMessageEvent {
  user: string;
  type: string;
  ts: string;
  client_msg_id?: string;
  bot_id?: string;
  app_id?: string;
  text: string;
  team: string;
  bot_profile?: SlackBotProfile;
  blocks: SlackEventBlock[];
  channel: string;
  event_ts: string;
  channel_type: string;
  thread_ts?: string;
  parent_user_id?: string;
}

interface SlackAuthorization {
  enterprise_id: null | string;
  team_id: string;
  user_id: string;
  is_bot: boolean;
  is_enterprise_install: boolean;
}

interface SlackEventCallback {
  token: string;
  team_id: string;
  context_team_id: string;
  context_enterprise_id: null | string;
  api_app_id: string;
  event: SlackMessageEvent;
  type: SlackEventType.EventCallback;
  event_id: string;
  event_time: number;
  authorizations: SlackAuthorization[];
  is_ext_shared_channel: boolean;
  event_context: string;
}

export type SlackPayload = SlackUrlVerification | SlackEventCallback;
