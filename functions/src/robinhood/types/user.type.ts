export interface IRobinhoodUser {
  "url": string; // url
  "id": string;
  "id_info": string; // url
  "username": string;
  "email": string;
  "email_verified": boolean;
  "first_name": string;
  "last_name": string;
  "origin": {
    "locality": string,
  };
  "profile_name": string;
  "created_at": string; // iso date string
}
