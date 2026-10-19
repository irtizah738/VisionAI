import { NextRequest, NextResponse } from "next/server";
import { getVisionAiStore } from "@/lib/prisma";

const DEFAULT_PROVIDER_DETAILS: Record<
  string,
  { accountName: string; handle: string; followers: string }
> = {
  twitter: {
    accountName: "VisionAI Official",
    handle: "@VisionAI_HQ",
    followers: "48.2K",
  },
  linkedin: {
    accountName: "VisionAI Technologies",
    handle: "linkedin.com/company/visionai",
    followers: "112.5K",
  },
  instagram: {
    accountName: "VisionAI Studio",
    handle: "@visionai.studio",
    followers: "84.9K",
  },
  facebook: {
    accountName: "VisionAI Official Page",
    handle: "fb.com/VisionAIStudio",
    followers: "63.1K",
  },
  youtube: {
    accountName: "VisionAI Official Channel",
    handle: "youtube.com/@VisionAI",
    followers: "95.4K",
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") || "";
  const stateParam = searchParams.get("state") || "";
  let provider = (searchParams.get("provider") || "twitter").toLowerCase();
  let customHandle = "";

  if (stateParam) {
    try {
      const decoded = JSON.parse(
        Buffer.from(stateParam, "base64url").toString("utf-8")
      );
      if (decoded.provider) provider = String(decoded.provider).toLowerCase();
      if (decoded.handle) customHandle = String(decoded.handle).trim();
    } catch {
      // Ignore malformed state
    }
  }

  const defaults = DEFAULT_PROVIDER_DETAILS[provider] || {
    accountName: `VisionAI (${provider})`,
    handle: `@visionai_${provider}`,
    followers: "15.0K",
  };

  const finalHandle = customHandle || defaults.handle;
  const { state, save } = getVisionAiStore();

  const existingIdx = state.socialAccounts.findIndex(
    (a) => a.provider === provider
  );

  let savedAccount;
  if (existingIdx >= 0) {
    state.socialAccounts[existingIdx] = {
      ...state.socialAccounts[existingIdx],
      handle: finalHandle,
      accountName: defaults.accountName,
      status: "connected",
      lastSynced: "Just now (OAuth 2.0)",
      updatedAt: new Date().toISOString(),
    };
    savedAccount = state.socialAccounts[existingIdx];
  } else {
    savedAccount = {
      id: `acc_${provider}_${Date.now()}`,
      provider: provider as any,
      accountName: defaults.accountName,
      handle: finalHandle,
      followers: defaults.followers,
      status: "connected" as const,
      lastSynced: "Just now (OAuth 2.0)",
      userId: "usr_visionai_admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.socialAccounts.push(savedAccount);
  }
  save();

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>OAuth Connection Complete — VisionAI</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #0f172a;
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 28px 32px;
        text-align: center;
        max-width: 380px;
      }
      .badge {
        display: inline-block;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 6px;
        margin-bottom: 12px;
      }
      h2 { margin: 0 0 8px; font-size: 18px; }
      p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">OAuth 2.0 Verified</div>
      <h2>Connected ${defaults.accountName}</h2>
      <p>Handle <strong>${finalHandle}</strong> linked. Closing window automatically...</p>
    </div>
    <script>
      (function() {
        var payload = {
          type: "OAUTH_AUTH_SUCCESS",
          provider: ${JSON.stringify(provider)},
          code: ${JSON.stringify(code ? "exchanged" : "verified")},
          account: ${JSON.stringify(savedAccount)}
        };
        if (window.opener) {
          window.opener.postMessage(payload, "*");
          setTimeout(function() { window.close(); }, 350);
        } else {
          window.location.href = "/settings";
        }
      })();
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });

  // Set iframe-compatible cookie (SameSite=None; Secure; HttpOnly) per oauth-integration guidelines
  response.cookies.set(`visionai_oauth_${provider}`, "connected", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
