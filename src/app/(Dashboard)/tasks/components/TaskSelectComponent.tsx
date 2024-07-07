import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";
export type SelectComponentType = {
  onValueChange: (value: any) => void;
  disabled: boolean;
  value: any;
  type: "priority" | "status";
  defaultValue: string;
  options: { label: string; value: string; color: string }[];
};

const StatusOptionComponent = ({
  option,
  type,
}: {
  option: { label: string; value: string; color: string };
  type: "priority" | "status";
}) => {
  return (
    <SelectItem value={option.value}>
      {type === "status" ? (
        <div className="w-[130px]">
          <div
            style={{ backgroundColor: option.color }}
            className={cn(" flex items-center  gap-2 px-2 py-1 rounded-full ")}
          >
            <div className=" w-4 h-4 rounded-full bg-white/40" />
            <p className=" text-white/80">{option.label}</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div
            style={{ backgroundColor: option.color }}
            className="flex items-center rounded-md px-4 py-1 gap-2"
          >
            <p className="text-white/90">{option.label}</p>
          </div>
        </div>
      )}
    </SelectItem>
  );
};

export function TaskSelectComponent({
  onValueChange,
  disabled,
  value,
  type,
  options,
  defaultValue,
}: SelectComponentType) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onValueChange}
      value={value}
      defaultValue={defaultValue}
    >
      <SelectTrigger className=" ">
        <SelectValue defaultValue={defaultValue} />
      </SelectTrigger>

      <SelectContent className="w-[180px] ">
        <SelectGroup>
          <SelectLabel>{type === "status" ? "Status" : "Priority"}</SelectLabel>
          <div className="h-[1px] w-full bg-gray-300" />
          {options.map((option) => (
            <StatusOptionComponent
              option={option}
              key={option.value}
              type={type}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
