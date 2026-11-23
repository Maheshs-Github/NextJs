import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user";

export const authOptions:NextAuthOptions={
  providers:[
    CredentialsProvider({
      id:"credentials",
      name:"Credentials",
      credentials:{
              identifier: { label: "Email or username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any):Promise<any> {
        await dbConnect();
        try {
          const user=await UserModel.findOne({
            $or:[
              {email:credentials.identifier},
              {username:credentials.identifier}

            ]
          })
          if (!user) return null;

          if (!user.isVerified) return null;

          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);

          if (!isPasswordCorrect) return null;

          // Return only the fields needed by the JWT/session callbacks.
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessage,
          };
          
        } catch (error) {
          console.error("Credentials authorization failed:", error);
          return null;
          
        }
      }
    })
  ],

  callbacks:{
    async session({ session, token }) {
      if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username;
      }
      return session
    },
    async jwt({ token, user }) {
      if(user){
        token._id=user._id?.toString();
        token.isVerified=user.isVerified;
        token.isAcceptingMessages=user.isAcceptingMessages;
        token.username=user.username;
      }
      return token
    }
  },

  pages: {
    signIn: '/sign-in',
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,

}
