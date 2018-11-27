interface Link {
  name: string;
  link: string;
}

export default interface User {
  userId: string;
  fullName: string;
  links?: Link[];
}
