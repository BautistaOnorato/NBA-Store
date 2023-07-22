"use client";

import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store,
  StoreIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/useStoreModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Store as StoreType } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: StoreType[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  items = [],
  className,
}) => {
  const { onOpen } = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (value: string) => {
    setOpen(false);
    router.push(`/${value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store" />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems?.map((item) => (
                <CommandItem
                  key={item.value}
                  className="text-sm cursor-pointer"
                  onSelect={() => onStoreSelect(item.value)}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                className="text-sm cursor-pointer"
                onSelect={() => {
                  setOpen(false)
                  onOpen()
                }}
              >
                Create Store
                <PlusCircle className="ml-auto h-5 w-5" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
