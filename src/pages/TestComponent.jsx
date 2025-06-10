import { useState, useRef, useEffect } from "react";

const DropdownInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sample data - you can replace this with your own data
  const items = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
    "Kiwi",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Strawberry",
  ];

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

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleItemClick = (item) => {
    setSelectedItem((state) => {
      if (state.includes(item)) {
        return state.filter((i) => i !== item);
      } else {
        return [...state, item];
      }
    });
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search fruits..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

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
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedItem.includes(item)}
                    className="mr-2 accent-teal-500 "
                    readOnly={true}
                  />
                  <div className="flex-1">{item}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No items found</div>
            )}
          </div>
        )}
      </div>

      {/* Demo info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          {selectedItem.length > 0 &&
            selectedItem.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default DropdownInput;
