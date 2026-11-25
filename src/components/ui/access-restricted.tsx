"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE_META } from "@/lib/rbac";
import { UserRole } from "@/lib/types";

export function AccessRestricted({
  role,
  areaName = "this interface",
  returnHref = "/admin",
  returnLabel = "Return to Authorized Overview"
}: {
  role: UserRole;
  areaName?: string;
  returnHref?: string;
  returnLabel?: string;
}) {
  const roleTitle = ROLE_META[role]?.title || role;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4" data-testid="access-restricted">
      <Card className="max-w-md w-full border-rose-200 dark:border-rose-900/60 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Access Restricted
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your active role (<strong className="text-slate-900 dark:text-white">{roleTitle}</strong>) does not have permission to view {areaName}.
            </p>
          </div>
          <Link href={returnHref} className="inline-block pt-2">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{returnLabel}</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
