export interface CreateUserDto {
  email: string;
  mdp: string;
  pseudo: string;
  status?: "privé" | "public";
}

export interface CreatePostDto {
  id_user: string;
  content: string;
}

export interface CreateCommentDto {
  id_post: string;
  content: string;
}
