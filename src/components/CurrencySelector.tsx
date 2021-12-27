// import { CurrencyHashTable } from "../utils/currencyPairs";
import React from "react";
import { currencyPairs } from "../utils/currencyPairs";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { styled } from "@stitches/react";

interface SelectorProps {
  id: string;
  setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  currencyCode: string;
}

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 220,
  backgroundColor: "white",
  borderRadius: 6,
  padding: 5,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  maxHeight: 300,
  overflowY: "scroll",
  // '@media (prefers-reduced-motion: no-preference)': {
  //   animationDuration: '400ms',
  //   animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  //   willChange: 'transform, opacity',
  //   '&[data-state="open"]': {
  //     '&[data-side="top"]': { animationName: slideDownAndFade },
  //     '&[data-side="right"]': { animationName: slideLeftAndFade },
  //     '&[data-side="bottom"]': { animationName: slideUpAndFade },
  //     '&[data-side="left"]': { animationName: slideRightAndFade },
  //   },
  // },
});

const itemStyles = {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  color: "violet",
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 5px",
  position: "relative",
  paddingLeft: 25,
  userSelect: "none",

  "&[data-disabled]": {
    color: "grey",
    pointerEvents: "none",
  },

  "&:focus": {
    backgroundColor: "violet",
    color: "white",
  },
};
const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, {
  ...itemStyles,
});
const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledMenuTrigger = styled(DropdownMenuPrimitive.Trigger, {
  background:
    "linear-gradient(80deg, rgba(142,24,131,0.6951155462184874) 0%, rgba(182,180,22,0.8491771708683473) 89%)",
  // border: "1px solid transpa",
  border: "none",
  height: "100%",
  color: "#fff",
  borderRadius: 6,
  boxShadow:
    "inset 1px 1px 10px rgb(255 255 255 / 50%), inset -30px -30px 50px rgb(255 255 255 / 2%), 2px -2px 10px rgb(0 0 0 / 10%)",
  padding: "0.6rem 0.8rem",
});

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = StyledMenuTrigger;
export const DropdownMenuContent = StyledContent;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;

const CurrencySelector = ({
  id,
  setCurrencyCode,
  currencyCode,
}: SelectorProps): JSX.Element => {
  // const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newCurrencyCode = e.target.value;
  //   setCurrencyCode(newCurrencyCode);
  // };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{currencyCode}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          id={id}
          value={currencyCode}
          onValueChange={setCurrencyCode}
        >
          {Object.entries(currencyPairs).map((entry, index) => {
            const [currencyCode, currencyDescription] = entry;
            return (
              <DropdownMenuRadioItem key={index} value={currencyCode}>
                {currencyCode} - {currencyDescription}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
// const CurrencySelector = ({
//   id,
//   setCurrencyCode,
//   currencyCode,
// }: SelectorProps): JSX.Element => {
//   const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newCurrencyCode = e.target.value;
//     setCurrencyCode(newCurrencyCode);
//   };
//   return (
//     <select id={id} onChange={handleCurrencyChange} value={currencyCode}>
//       {Object.entries(currencyPairs).map((entry, index) => {
//         const [currencyCode, currencyDescription] = entry;
//         return (
//           <option key={index} value={currencyCode}>
//             {currencyCode} - {currencyDescription}
//           </option>
//         );
//       })}
//     </select>
//   );
// };

export default CurrencySelector;
