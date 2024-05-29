"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { api } from "@repo/trpc/src/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  useToast,
} from "..";

import { RouterOutputs } from "@repo/api";

export type ReviewsType = RouterOutputs["review"]["findAll"]["data"];

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ReviewsType[number];
}

export function DeleteReview({ isOpen, onOpen, data, onClose }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { id: reviewId } = data;

  const mutateDeleteReview = api.review.delete.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();
      toast({
        variant: "success",
        description: `Review deleted successful`,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error?.message ?? "Error deleting review. Try again",
      });
      router.refresh();
    },
  });

  const handleClose = () => {
    onClose();
  };

  const isDeleting = mutateDeleteReview.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Delete this review?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete this review. This action cannot be reversed.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="w-full md:w-2/4"
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => mutateDeleteReview.mutate({ id: reviewId })}
          >
            {isDeleting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="mb-3 w-full md:mb-0 md:w-2/4"
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
