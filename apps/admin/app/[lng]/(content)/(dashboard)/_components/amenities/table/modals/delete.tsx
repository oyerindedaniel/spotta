"use client";

import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import { api } from "@repo/api/src/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  useToast,
} from "@repo/ui";

import { AmenitiesType } from "../columns";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: AmenitiesType[number];
}

export default function DeleteAmenity({
  isOpen,
  onOpen,
  data,
  onClose,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { id: amenityId, name } = data;

  const mutateDeleteAmenity = api.amenity.delete.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();
      toast({
        variant: "success",
        description: `Amenity deleted successful`,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error?.message || "Error deleting amenity. Try again",
      });
      router.refresh();
    },
  });

  const handleClose = () => {
    onClose();
  };

  const isDeleting = mutateDeleteAmenity.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Delete this amenity?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete area ‘${name}’. This action cannot be reversed.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="w-full md:w-2/4"
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => mutateDeleteAmenity.mutate({ id: amenityId })}
          >
            {isDeleting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="w-full md:w-2/4"
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
