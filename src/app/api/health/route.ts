import { NextResponse } from "next/server";
import { getVisionAiStore } from "@/lib/prisma";
import firebaseConfig from "../../../../firebase-applet-config.json";

export async function GET() {
  const { state } = getVisionAiStore();

  const oauthProviders = {
    twitter: Boolean(process.env.TWITTER_CLIENT_ID),
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID),
    instagram: Boolean(process.env.INSTAGRAM_CLIENT_ID),
    facebook: Boolean(process.env.FACEBOOK_CLIENT_ID),
    youtube: Boolean(process.env.GOOGLE_CLIENT_ID),
  };

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      geminiAiProxy: Boolean(process.env.GEMINI_API_KEY) ? "configured" : "ready",
      firebaseFirestore: {
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId,
        status: "provisioned",
      },
      workspaceStore: {
        postsCount: state.posts.length,
        campaignsCount: state.campaigns.length,
        connectedAccountsCount: state.socialAccounts.filter(
          (a) => a.status === "connected"
        ).length,
      },
      oauthProviders,
    },
  });
}
