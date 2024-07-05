"use client";

import { NavArrowDown } from "iconoir-react";
import { ComponentProps, useState } from "react";
import { Button } from "./Buttons";

export type DropdownProps = ComponentProps<"div"> & { label: string };
export default function Dropdown({ label, children }: DropdownProps) {
  const [show, setShow] = useState(false);

  const handleButtonClick = () => {
    setShow(!show);
  };

  return (
    <div className="relative">
      <Button variant="light" onClick={handleButtonClick}>
        {label}
        <NavArrowDown />
      </Button>
      <div
        className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ${
          show ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
