"use client";

import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { Button } from "./button";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute left-3 top-2/4 -translate-y-2/4">
            {leftIcon}
          </span>
        )}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          className={cn(
            "flex h-11 w-full rounded-md border bg-brand-primary border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-[60px]",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" || rightIcon ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-1">
            {!rightIcon && (
              <Button
                aria-label="toggle show password"
                onClick={handleClick}
                size="sm"
                className="w-9 h-9 px-0"
                type="button"
                variant="ghost"
              >
                {show ? <EyeNoneIcon /> : <EyeOpenIcon />}
              </Button>
            )}
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
