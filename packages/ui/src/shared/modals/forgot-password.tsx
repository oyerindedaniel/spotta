"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@repo/api/src/react";
import { useModal } from "@repo/hooks";
import {
  ForgotPasswordConfirmationType,
  ForgotPasswordEnum,
  ForgotPasswordType,
  forgotPasswordConfirmationSchema,
  forgotPasswordSchema,
} from "@repo/validations";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  useToast,
} from "../../";

type FormDataType<T extends ForgotPasswordEnum> =
  T extends ForgotPasswordEnum.ForgotPassword
    ? ForgotPasswordType
    : T extends ForgotPasswordEnum.ForgotPasswordConfirmation
      ? ForgotPasswordConfirmationType
      : never;

export function ForgotPassword() {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "forgotPassword";

  const { toast } = useToast();

  const { forgotPassword: session } = data;

  const router = useRouter();

  const [status, setStatus] = useState<ForgotPasswordEnum>(
    ForgotPasswordEnum.ForgotPassword,
  );

  const handleClose = () => {
    onClose();
  };

  type ActiveFormData = FormDataType<typeof status>;

  const getSchema = (status: ForgotPasswordEnum): z.Schema<ActiveFormData> => {
    switch (status) {
      case ForgotPasswordEnum.ForgotPassword:
        return forgotPasswordSchema;
      case ForgotPasswordEnum.ForgotPasswordConfirmation:
        return forgotPasswordConfirmationSchema;
      default:
        throw new Error(`No schema found for status: ${status}`);
    }
  };

  const form = useForm<ActiveFormData>({
    resolver: zodResolver(getSchema(status)),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [isModalOpen]);

  const mutateForgotPassword = api.user.forgotPassword.useMutation({
    onSuccess: (_, variables) => {
      form.reset();
      toast({
        variant: "success",
        description: `OTP sent to ${variables.email}. Please check your email inbox.`,
      });
      setStatus(ForgotPasswordEnum.ForgotPasswordConfirmation);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
    },
  });

  const mutateForgotPasswordConfirmation =
    api.user.forgotPasswordConfirmation.useMutation({
      onSuccess: () => {
        form.reset();
        toast({
          variant: "success",
          description: `Password changed successfully.`,
        });
        handleClose();
        router.push("/login");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error?.message,
        });
        console.error(error);
      },
    });

  const onSubmit = (data: ActiveFormData) => {
    if (status === ForgotPasswordEnum.ForgotPassword) {
      const forgotPasswordData = data as ForgotPasswordType;

      return mutateForgotPassword.mutate(forgotPasswordData);
    }

    if (status === ForgotPasswordEnum.ForgotPasswordConfirmation) {
      const forgotPasswordConfirmationData =
        data as ForgotPasswordConfirmationType;

      return mutateForgotPasswordConfirmation.mutate(
        forgotPasswordConfirmationData,
      );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="flex w-full items-center gap-3">
              {status !== ForgotPasswordEnum.ForgotPassword && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setStatus(ForgotPasswordEnum.ForgotPassword)}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              )}
              Forgot Password
            </span>
          </DialogTitle>
          <DialogDescription>
            {status === ForgotPasswordEnum.ForgotPassword
              ? "Please enter your email address to receive an otp."
              : "Enter Otp and your new password."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full max-w-[600px] flex-col gap-4"
            >
              {status === ForgotPasswordEnum.ForgotPassword ? (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={mutateForgotPassword.isPending}
                  >
                    {mutateForgotPassword.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Otp</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Please enter the one-time otp sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-[50%]">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="self-top flex-[50%]">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={mutateForgotPasswordConfirmation.isPending}
                  >
                    {mutateForgotPasswordConfirmation.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
