"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Area } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ScrollArea,
} from "@repo/ui";

interface Props {
  lng: LanguagesType;
  areas: Array<Pick<Area, "id" | "name" | "slug">>;
}

export default function HomeSearchInput({ lng, areas }: Props) {
  const [isTagInputFocused, setIsTapInputFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsTapInputFocused(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <form>
      <div className="relative">
        <Command
          value={inputValue}
          onValueChange={setInputValue}
          className="mb-4 rounded-b-none border shadow-md"
          ref={ref}
        >
          <CommandInput
            required
            placeholder="Enter address"
            onFocus={() => setIsTapInputFocused(true)}
          />
          <CommandList
            className={cn(
              "absolute bottom-0 left-0 right-0 z-20 w-full translate-y-full rounded-b-lg bg-brand-primary",
              {
                hidden: !isTagInputFocused,
              },
            )}
          >
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-fit w-full pr-3">
                <div className="max-h-28">
                  {areas.map((area) => (
                    <CommandItem key={area.id} className="py-2.5">
                      <Link href={`/areas/${area.slug}`}>{area.name}</Link>
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <Button type="submit" size="lg" className="uppercase">
        Search
      </Button>
    </form>
  );
}

{
  /* <Input
          required
          className="mb-4"
          onChange={onOpen}
          leftIcon={
            <MagnifyingGlassIcon className="size-5 text-[#0D2159] dark:text-[#BACAF5]" />
          }
          placeholder="Enter Address"
        /> */
}
