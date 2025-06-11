import React, { useEffect, useRef, useState } from "react";
import CustomCheckbox from "./CustomCheckbox";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchCheckbox(props) {
  const {
    inputValue,
    setInputValue,
    items,
    filteredItems,
    setFilteredItems,
    selectedItem,
    setSelectedItem,
    className,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleItemClick = (item) => {
    // console.log(item);
    setSelectedItem((state) => {
      if (state.includes(item)) {
        return state.filter((i) => i !== item);
      } else {
        return [...state, item];
      }
    });
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Filter items based on input value
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [inputValue]);

  useEffect(() => {
    // Handle clicks outside the component
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search fruits..."
          //   className="w-full px-4 py-2 pl-9 border text-[14px] font-[400] placeholder:text-slate-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            `pl-9 w-full`
          )}
        />
        {/* <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search fruits..."
          className="pl-9"
        /> */}

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-none overflow-hidden shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="px-4 py-[2px] cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2"
                >
                  <CustomCheckbox checked={selectedItem.includes(item)} />
                  <div className="flex-1">{item}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No items found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchCheckbox;
