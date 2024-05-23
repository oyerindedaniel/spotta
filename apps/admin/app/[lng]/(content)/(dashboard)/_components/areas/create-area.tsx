"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUploadThing } from "@repo/hooks/src/use-upload-file";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
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
import { filterFilesForUpload, getLgasByState, STATES } from "@repo/utils";
import { createAreaSchema } from "@repo/validations";

type CreateAreaType = z.infer<typeof createAreaSchema>;

export default function CreateArea({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const router = useRouter();
  const { toast } = useToast();

  const requiredMessage = "Input not instance of File";

  const { startUpload, isUploading, progresses } =
    useUploadThing("areaMediasUploader");

  const defaultMedias = new Array("").filter(Boolean);

  const medias =
    defaultMedias.length > 0 ? (defaultMedias as Array<string>) : undefined;

  const form = useForm<CreateAreaType>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: "",
      state: "",
      lga: "",
      coordinates: {
        address: "",
        longitude: undefined,
        latitude: undefined,
      },
      medias,
    },
  });

  const mutateCreateArea = api.area.create.useMutation({
    onSuccess: ({ data }) => {
      const { name } = data;
      toast({
        variant: "success",
        description: `Successfully created ${name} area`,
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

  const state = form.getValues("state");

  console.log(state);

  const lgasByState = useMemo(() => getLgasByState({ state }), [state]);

  console.log(lgasByState);

  console.log(form.getValues("state"));

  useEffect(() => {
    if (state && lgasByState) form.setValue("lga", lgasByState[0]!);
  }, [state, lgasByState]);

  const onSubmit = async (data: CreateAreaType) => {
    const isFile = !!filterFilesForUpload(data.medias).length;
    try {
      const mediasUrls = isFile
        ? (await startUpload(filterFilesForUpload(data.medias)))?.map(
            (data) => data.url,
          )
        : medias;
      mutateCreateArea.mutate({
        ...data,
        medias: mediasUrls as Array<string>,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.message ?? "Error updating profile",
      });
    }
  };

  const formPictureError = form.formState.errors.medias;

  const isUpdating = mutateCreateArea.isPending || isUploading;

  return (
    <div className="mx-auto max-w-[35rem]">
      <div className="text-2xl font-medium">Create a new Area</div>
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
                    <Input type="email" placeholder="Name of Area" {...field} />
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
                      {STATES.map((state) => (
                        <SelectItem key={state.name} value={state.name}>
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
                  <FormLabel required>Select city</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={form.getValues("lga")}
                    defaultValue={field?.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lgasByState ? (
                        lgasByState.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="sss">
                            Select state first
                          </SelectItem>
                        </>
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
                        //@ts-ignore
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
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
