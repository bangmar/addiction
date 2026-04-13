import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      authProviders?: string[];
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    authProviders?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    authProviders?: string[];
  }
}
