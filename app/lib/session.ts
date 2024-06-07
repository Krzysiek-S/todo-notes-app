import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";

export async function getSession(context: GetServerSidePropsContext): Promise<Session | null>  {
    return await getServerSession(context.req, context.res, authOptions);
  }