"use client";

import Image from "next/image";
import { Icons } from "@/assets";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

import { buttonVariants, Dialog, DialogContent } from "@repo/ui";
import { getEmailProviderLink } from "@repo/utils";

export function EmailConfirmation() {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "emailConfirmation";

  const { emailConfirmation: email } = data;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <div className="mb-5 flex flex-col items-center justify-center">
            <Image
              alt="Email verification"
              className="mb-3"
              height={70}
              src={Icons.email}
              width={70}
            />
            <span className="text-sm font-medium text-brand-blue">
              Verify E-mail Address
            </span>
          </div>
          <p className="mb-2 text-center text-sm">
            Thank you for signing up on spotta. In order to keep your account
            safe and secure, we’ll need you to verify your e-mail address by
            clicking the verification link sent to your mail box. Thank you!
          </p>
        </div>
        <a
          href={getEmailProviderLink(email ?? "")!}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-semibold uppercase",
            buttonVariants({ size: "lg" }),
          )}
        >
          Go to your mailbox
        </a>
      </DialogContent>
    </Dialog>
  );
}
