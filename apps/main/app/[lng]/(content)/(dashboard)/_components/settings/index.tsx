import { Suspense } from "react";

import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";

import ResetPassword from "./reset-password";
import Sessions from "./session/sessions";

export default async function Settings({ lng }: { lng: LanguagesType }) {
  const user = await useAuth();
  return (
    <div>
      <Tabs defaultValue="session" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="reset-password">Reset password</TabsTrigger>
        </TabsList>
        <TabsContent value="session">
          <Suspense fallback={"loading Sessions..."}>
            <Sessions lng={lng} user={user} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reset-password">
          <ResetPassword lng={lng} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
