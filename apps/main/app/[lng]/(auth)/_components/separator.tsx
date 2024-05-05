"use client";

import { Separator } from "@repo/ui";

interface Props extends React.PropsWithChildren {}

const AuthSeparator: React.FC<Props> = ({ children }) => {
  return (
    <div className="my-2 flex items-center gap-6">
      <Separator className="bg-brand-blue" />
      <span className="text-sm">{children}</span>
      <Separator className="bg-brand-blue" />
    </div>
  );
};

export default AuthSeparator;
