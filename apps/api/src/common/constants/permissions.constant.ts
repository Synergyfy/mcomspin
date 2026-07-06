export const Permissions = {
  Business: {
    Create: 'business:create',
    Read: 'business:read',
    Update: 'business:update',
    Delete: 'business:delete',
  },
  Campaign: {
    Create: 'campaign:create',
    Read: 'campaign:read',
    Update: 'campaign:update',
    Delete: 'campaign:delete',
    Approve: 'campaign:approve',
    Feature: 'campaign:feature',
  },
  Reward: {
    Manage: 'reward:manage',
    Redeem: 'reward:redeem',
  },
  User: {
    Manage: 'user:manage',
    Suspend: 'user:suspend',
  },
  Borough: {
    Assign: 'borough:assign',
    Override: 'borough:override',
  },
  Moderation: {
    Review: 'moderation:review',
    Escalate: 'moderation:escalate',
  },
  Billing: {
    Read: 'billing:read',
    Refund: 'billing:refund',
  },
} as const;
