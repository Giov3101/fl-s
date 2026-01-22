import { useState, useRef, useEffect } from "react";
import { ChevronDown } from 'lucide-react'

type Option<T extends string> = {
  label: string;
  value: T;
};

type CustomSelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  dropdownWidth?: string;
  className?: string; // New prop for custom classes
};

export function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  dropdownWidth = "w-full",
  className = "", // Default empty
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${className}`}
      >
        <div className="flex space-x-2 items-center">
          <span>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="pointer-events-none inset-y-0 right-0 flex items-center text-white">
            <ChevronDown className="w-4" />
          </div>
        </div>
      </button>

      {open && (
        <ul className={`absolute z-10 mt-4 ${dropdownWidth} bg-gray-100 rounded-md shadow-lg overflow-hidden`}>
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`my-3 px-12 py-2 cursor-pointer text-gray-800 transition-colors
                hover:bg-gray-300
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}