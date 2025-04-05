export type SlackUserInfo = {
  ok: boolean;
  user: {
    id: string;
    team_id: string;
    name: string;
    deleted: boolean;
    color: string;
    real_name: string;
    tz: string;
    tz_label: string;
    tz_offset: number;
    profile: {
      email: string;
      first_name: string;
      last_name: string;
      status_text_canonical: string;
      team: string;
    };
    is_admin: boolean;
    is_owner: boolean;
    is_primary_owner: boolean;
    is_restricted: boolean;
    is_ultra_restricted: boolean;
    is_bot: boolean;
    is_app_user: boolean;
    updated: number;
    is_email_confirmed: boolean;
    who_can_share_contact_card: string;
  };
};

export type SlackChannelResponse = {
  ok: boolean;
  channel: {
    id: string;
    name: string;
  };
};

export type SlackOrganizationResponse = {
  ok: boolean;
  team: {
    id: string;
    name: string;
  };
};

export type SlackGroupMembersResponse = {
  ok: boolean;
  users: string[];
};
