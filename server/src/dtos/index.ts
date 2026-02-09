export interface CreateUserDto {
  email: string;
  mdp: string;
  pseudo: string;
  bPrivate?: boolean;
}

export interface CreatePostDto {
  id_user: string;
  content: string;
}

export interface CreateCommentDto {
  id_post: string;
  id_user: string;
  content: string;
}
