import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import { api } from "@repo/trpc/src/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@repo/ui";

import { AreasType } from "../columns";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: AreasType[number];
}

export default function DeleteArea({ isOpen, onOpen, data, onClose }: Props) {
  const router = useRouter();

  const { id: areaId, name } = data;

  const mutateDeleteArea = api.area.delete.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleClose = () => {
    onClose();
  };

  const isDeleting = mutateDeleteArea.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Delete this area?
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
            onClick={() => mutateDeleteArea.mutate({ id: areaId })}
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
