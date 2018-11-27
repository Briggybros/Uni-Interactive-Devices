export interface Link {
  name: string;
  link: string;
}

export interface User {
  userId: string;
  fullName: string;
  links: Link[];
}
