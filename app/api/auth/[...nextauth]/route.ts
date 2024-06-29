import dbConnect from "@/database";
import { AdminModel, AdminType, UserModel } from "@fcai-sis/shared-models";
import { Role } from "@fcai-sis/shared-middlewares";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.password === undefined ||
          credentials?.username === undefined
        ) {
          return null;
        }

        await dbConnect();

        const admin: AdminType | null = await AdminModel.findOne({
          username: credentials.username,
        });

        if (!admin) return null;

        const user = await UserModel.findById(admin.user);

        if (!user) return null;

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) return null;

        return {
          id: user._id,
          email: user._id,
          name: Role.ADMIN,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
