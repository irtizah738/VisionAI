"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { BackendDevOpsCenter } from "@/components/devops/backend-devops-center";
import { Server } from "lucide-react";

export default function MonitoringAndDevOpsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Backend, Queue & DevOps Operations Center"
        description="Zero-trust Firebase Firestore RBAC telemetry, idempotent scheduled post dispatch & dead-letter retry queue, OAuth 2.0 token rotation, HMAC-SHA256 webhook ingestion, and Google Cloud Run CI/CD."
        icon={Server}
      />
      <BackendDevOpsCenter />
    </div>
  );
}