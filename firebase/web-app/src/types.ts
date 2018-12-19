export interface Link {
  name: string;
  link: string;
  visible: boolean;
}

export function validateLink(link: any): Link | null {
  if (
    typeof link === 'object' &&
    !!link.name &&
    typeof link.name === 'string' &&
    !!link.link &&
    typeof link.link === 'string' &&
    !!link.visible &&
    typeof link.visible === 'boolean'
  ) {
    return link as Link;
  }
  return null;
}

export interface User {
  displayName: string;
  links: Link[];
  badgeId?: string;
  private: boolean;
  whitelist: string[];
  requests: string[];
  contacts: string[];
}

export function validateUser(user: any): User | null {
  if (
    typeof user === 'object' &&
    !!user.displayName &&
    typeof user.displayName === 'string' &&
    !!user.links &&
    Array.isArray(user.links) &&
    (user.links as any[]).every(link => !!validateLink(link)) &&
    typeof user.private === 'boolean' &&
    !!user.whitelist &&
    Array.isArray(user.whitelist) &&
    !!user.requests &&
    Array.isArray(user.requests) &&
    !!user.contacts &&
    Array.isArray(user.contacts)
  ) {
    return user as User;
  }
  return null;
}
