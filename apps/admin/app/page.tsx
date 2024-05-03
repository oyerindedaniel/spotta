"use client";

import { api } from "@repo/trpc/src/react";
import { Button } from "@repo/ui";

export default function Page(): JSX.Element {
  const isSiteOkay = api.auth.getSession.useQuery();

  console.log("issiteoks", isSiteOkay.data);
  return (
    <main className="bg-red-300">
      <p>Daniel2</p>
      <Button type="button" size="lg">
        Clickss
      </Button>
    </main>
  );
}
