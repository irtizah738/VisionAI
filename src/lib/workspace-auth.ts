"use client";

export const WORKSPACE_AUTH_STORAGE_KEY = "visionai_workspace_authenticated";
export const WORKSPACE_USER_EMAIL_KEY = "visionai_workspace_user_email";
export const WORKSPACE_AUTH_COOKIE = "visionai_auth";

export function isWorkspaceAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(WORKSPACE_AUTH_STORAGE_KEY);
    if (stored === "true") return true;
    if (document.cookie.split(";").some((c) => c.trim().startsWith(`${WORKSPACE_AUTH_COOKIE}=1`))) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getWorkspaceUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(WORKSPACE_USER_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function markWorkspaceAuthenticated(email?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_AUTH_STORAGE_KEY, "true");
    if (email) {
      window.localStorage.setItem(WORKSPACE_USER_EMAIL_KEY, email);
    }
    document.cookie = `${WORKSPACE_AUTH_COOKIE}=1; path=/; max-age=${14 * 24 * 60 * 60}; SameSite=Lax`;
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function clearWorkspaceAuthenticated(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(WORKSPACE_AUTH_STORAGE_KEY);
    window.localStorage.removeItem(WORKSPACE_USER_EMAIL_KEY);
    document.cookie = `${WORKSPACE_AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // Ignore storage errors
  }
}
