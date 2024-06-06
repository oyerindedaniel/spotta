"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { api } from "@repo/api/src/react";
import { useUploadThing } from "@repo/hooks";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import {
  Button,
  FileUploader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Map,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  UncontrolledFormMessage,
  useToast,
} from "@repo/ui";
import {
  deletedMediaUrls,
  ensureArrayLength,
  getLgasByState,
  separateMediaFilesAndUrls,
  STATES,
} from "@repo/utils";
import { createAreaSchema } from "@repo/validations";

type CreateAreaType = z.infer<typeof createAreaSchema>;

type AreaOutputType = RouterOutputs["area"]["findById"]["data"];

type Props = {
  lng: LanguagesType;
} & (
  | {
      type: "create";
    }
  | {
      type: "edit";
      area: AreaOutputType;
    }
);

export default function CreateEditArea({
  lng,
  type,
  ...props
}: Props): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const router = useRouter();
  const { toast } = useToast();

  const requiredMessage = "Input not instance of File";

  const area = (props as { area: AreaOutputType }).area;
  const asEdit = !!(type === "edit" && area);

  const { startUpload, isUploading, progresses } =
    useUploadThing("areaMediasUploader");

  const defaultMedias = asEdit ? area.medias.map((media) => media.src) : [];

  const medias =
    defaultMedias.length > 0 ? (defaultMedias as Array<string>) : undefined;

  const form = useForm<CreateAreaType>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: asEdit ? area.name : "",
      state: asEdit ? area.state : "",
      lga: asEdit ? area.lga : "",
      coordinates: {
        address: asEdit ? area.address : "",
        longitude: asEdit ? area.longitude : undefined,
        latitude: asEdit ? area.latitude : undefined,
      },
      medias,
    },
  });

  const mutateCreateArea = api.area.create.useMutation({
    onSuccess: ({ data }) => {
      const { name } = data;
      form.reset();
      toast({
        variant: "success",
        description: `Successfully created area: ${name}`,
      });
      router.push("/areas");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
      router.refresh();
    },
  });

  const mutateUpdateArea = api.area.update.useMutation({
    onSuccess: ({ data }) => {
      const { name } = data;
      toast({
        variant: "success",
        description: `Successfully updated area: ${name} `,
      });
      router.push("/areas");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
      router.refresh();
    },
  });

  const state = form.watch("state");

  const lgasByState = useMemo(
    () => getLgasByState({ state }),
    [state],
  ) as string[];

  useEffect(() => {
    if (state && lgasByState) form.setValue("lga", lgasByState[0]!);
  }, [state, lgasByState]);

  const onSubmit = async (data: CreateAreaType) => {
    const { hasFile, mediaFiles, mediaUrls } = separateMediaFilesAndUrls(
      data.medias,
    );

    if (asEdit) {
      const deletedMedias = deletedMediaUrls(
        area.medias ?? [],
        mediaUrls ?? [],
      );

      const targetLength = 3;

      try {
        const createdMediaUrls = hasFile
          ? (await startUpload(mediaFiles))?.map((data) => data.url)
          : [];

        mutateUpdateArea.mutate({
          ...data,
          id: area.id,
          medias: (createdMediaUrls.length < targetLength
            ? ensureArrayLength(createdMediaUrls, targetLength)
            : createdMediaUrls ?? []) as Array<string>,
          deletedMedias,
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: err?.message || "Error updating area. Try Again",
        });
      }
      return;
    }

    try {
      const createdMediaUrls = hasFile
        ? (await startUpload(mediaFiles))?.map((data) => data.url)
        : medias;
      mutateCreateArea.mutate({
        ...data,
        medias: createdMediaUrls as Array<string>,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.message || "Error creating area",
      });
    }
  };

  const formPictureError = form.formState.errors.medias;

  const isUpdating =
    mutateCreateArea.isPending || mutateUpdateArea.isPending || isUploading;

  return (
    <div className="mx-auto max-w-[35rem]">
      <div className="text-2xl font-medium">
        {asEdit ? "Update" : "Create a New"} Area
      </div>
      <div className="my-6 w-full rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-[600px] flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Area</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name of Area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Select state</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field?.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATES.map((state, idx) => (
                        <SelectItem key={idx} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Select lga</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={form.getValues("lga")}
                    defaultValue={field?.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lga" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {state && lgasByState ? (
                        lgasByState.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))
                      ) : (
                        //@ts-ignore
                        <SelectItem value={undefined}>
                          Select state first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Map
                      inputProps={{
                        onChange: field.onChange,
                        value: field.value,
                      }}
                    />
                  </FormControl>
                  {form?.formState?.errors?.coordinates && (
                    <UncontrolledFormMessage message="Enter map details" />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medias"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={6}
                        maxSize={4 * 1024 * 1024}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <UncontrolledFormMessage
                      message={
                        formPictureError &&
                        formPictureError?.message?.toLowerCase() ===
                          requiredMessage?.toLowerCase()
                          ? `Image is required`
                          : formPictureError?.message
                      }
                    />
                  </FormItem>
                </div>
              )}
            />
            <Button
              className="mt-3 w-full uppercase"
              type="submit"
              size="lg"
              disabled={isUpdating}
            >
              {isUpdating && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {asEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
