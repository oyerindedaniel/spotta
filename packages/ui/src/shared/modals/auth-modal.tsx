"use client";

import { cn } from "@/lib/utils";
import { LanguagesType } from "@repo/i18n";
import { assignRedirectUrl } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface Props {
  lng: LanguagesType;
  title: string;
  body: string;
  description?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function AuthModal({
  lng,
  isOpen,
  onOpen,
  onClose,
  title,
  body,
  description,
}: Props) {
  const pathname = usePathname();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{body}</div>
        <DialogFooter>
          <Link
            href={`${assignRedirectUrl({ redirectUrl: `${pathname}`, goToPageUrl: `${lng}/login` })}`}
            className={cn(
              "font-semibold uppercase text-brand-blue w-full md:w-2/4",
              buttonVariants({ variant: "default", size: "sm" })
            )}
          >
            login
          </Link>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="w-full md:w-2/4"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
