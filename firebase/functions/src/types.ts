export interface Link {
  name: string;
  url: string;
}

export function validateLink(link: any): Link | null {
  if (
    typeof link === 'object' &&
    !!link.name &&
    typeof link.name === 'string' &&
    !!link.link &&
    typeof link.link === 'string'
  ) {
    return link as Link;
  }
  return null;
}

export interface User {
  id: string;
  fullName: string;
  links: Link[];
  badgeId?: string;
}

export function validateUser(user: any, id = true): User | null {
  if (
    typeof user === 'object' &&
    (id ? !!user.id && typeof user.id === 'string' : true) &&
    !!user.fullName &&
    typeof user.fullName === 'string' &&
    !!user.links &&
    Array.isArray(user.links) &&
    (user.links as any[]).every(link => !!validateLink(link))
  ) {
    return user as User;
  }
  return null;
}
