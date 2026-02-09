export interface User {
  id: string;
  email: string;
  mdp: string;
  pseudo: string;
  bPrivate: boolean;
  followers: string[]; //id_user
  following: string[];
  bAdmin: boolean;
}

export interface Post {
  id: string;
  id_user: string;
  like: number;
  content: string;
  date_creation: Date | string;
}

export interface Comment {
  id: string;
  id_post: string;
  like: number;
  content: string;
}
