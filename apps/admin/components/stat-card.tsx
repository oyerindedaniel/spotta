"use client";

import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";

export default function StatCard({
  lng,
  session,
  icon,
  color,
  count,
  name,
  children,
}: {
  lng: LanguagesType;
  session: User | null;
  icon?: React.ComponentType<React.HTMLAttributes<SVGElement>>;
  count: number;
  name: string;
  color: string;
  children: React.ReactNode;
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const Icon = icon;

  return (
    <div
      style={{ borderColor: color }}
      className="w-full rounded-md border-[0.5px] border-l-[5px] px-4 py-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#303030] text-white">
          {children}
        </div>
        <span className="text-xl font-medium uppercase">{name}</span>
      </div>
      <div className="text-right">
        <span className="text-5xl font-medium">{count}</span>
      </div>
    </div>
  );
}
