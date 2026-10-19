import { NextRequest, NextResponse } from "next/server";

interface OAuthProviderSpec {
  name: string;
  authEndpoint: string;
  scopes: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  docsUrl: string;
}

const OAUTH_PROVIDERS: Record<string, OAuthProviderSpec> = {
  twitter: {
    name: "X / Twitter",
    authEndpoint: "https://twitter.com/i/oauth2/authorize",
    scopes: "tweet.read tweet.write users.read offline.access",
    clientIdEnv: "TWITTER_CLIENT_ID",
    clientSecretEnv: "TWITTER_CLIENT_SECRET",
    docsUrl: "https://developer.x.com/en/portal/dashboard",
  },
  linkedin: {
    name: "LinkedIn",
    authEndpoint: "https://www.linkedin.com/oauth/v2/authorization",
    scopes: "openid profile email w_member_social",
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
    docsUrl: "https://www.linkedin.com/developers/apps",
  },
  instagram: {
    name: "Instagram",
    authEndpoint: "https://api.instagram.com/oauth/authorize",
    scopes: "user_profile,user_media",
    clientIdEnv: "INSTAGRAM_CLIENT_ID",
    clientSecretEnv: "INSTAGRAM_CLIENT_SECRET",
    docsUrl: "https://developers.facebook.com/apps",
  },
  facebook: {
    name: "Facebook",
    authEndpoint: "https://www.facebook.com/v19.0/dialog/oauth",
    scopes: "pages_manage_posts,pages_read_engagement,public_profile",
    clientIdEnv: "FACEBOOK_CLIENT_ID",
    clientSecretEnv: "FACEBOOK_CLIENT_SECRET",
    docsUrl: "https://developers.facebook.com/apps",
  },
  youtube: {
    name: "YouTube",
    authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    docsUrl: "https://console.cloud.google.com/apis/credentials",
  },
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await context.params;
  const provider = (rawProvider || "twitter").toLowerCase();
  const spec = OAUTH_PROVIDERS[provider];

  if (!spec) {
    return NextResponse.json(
      { error: `Unsupported OAuth provider: ${provider}` },
      { status: 400 }
    );
  }

  const origin =
    request.nextUrl.searchParams.get("origin") ||
    process.env.APP_URL ||
    request.nextUrl.origin;
  const handle = request.nextUrl.searchParams.get("handle") || "";
  const redirectUri = `${origin.replace(/\/$/, "")}/api/oauth/callback`;
  const clientId = process.env[spec.clientIdEnv];

  const statePayload = Buffer.from(
    JSON.stringify({
      provider,
      handle,
      timestamp: Date.now(),
    })
  ).toString("base64url");

  // If real 3P OAuth Client ID is configured in environment variables, build the provider's official OAuth URL
  if (clientId && clientId.trim().length > 0) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: spec.scopes,
      state: statePayload,
    });

    if (provider === "twitter") {
      params.set("code_challenge", "visionai_pkce_challenge");
      params.set("code_challenge_method", "plain");
    }

    return NextResponse.json({
      url: `${spec.authEndpoint}?${params.toString()}`,
      mode: "live_oauth",
      provider,
      redirectUri,
      docsUrl: spec.docsUrl,
    });
  }

  // Otherwise return the callback URL in instant popup handshake mode so the popup flow works out-of-the-box
  const callbackParams = new URLSearchParams({
    code: `oauth_live_${provider}_${Date.now()}`,
    state: statePayload,
    provider,
  });

  return NextResponse.json({
    url: `${redirectUri}?${callbackParams.toString()}`,
    mode: "sandbox_oauth_popup",
    provider,
    redirectUri,
    docsUrl: spec.docsUrl,
    missingEnv: [spec.clientIdEnv, spec.clientSecretEnv],
  });
}
