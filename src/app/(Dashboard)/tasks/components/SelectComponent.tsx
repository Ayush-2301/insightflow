// import * as React from "react";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// export type SelectComponentType = {
//   placeholder: string;
//   label: string;
//   options: { label: string; value: string }[];
// };

// export function SelectComponent({
//   placeholder,
//   label,
//   options,
// }: SelectComponentType) {
//   return (
//     <Select>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>{label}</SelectLabel>
//           {options.map((option) => (
//             <SelectItem key={option.value} value={option.value}>
//               {option.label}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// }

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectComponentType = {
  placeholder: string;
  label: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string | null) => void;
};

export function SelectComponent({
  placeholder,
  label,
  options,
  onValueChange,
}: SelectComponentType) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>

          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
