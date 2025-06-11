import SearchCheckbox from "@/components/SearchCheckbox";
import { useState, useRef, useEffect } from "react";

const DropdownInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
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

  return (
    <div className="w-full mt-8 max-w-md mx-auto">
      <SearchCheckbox
        inputValue={inputValue}
        setInputValue={setInputValue}
        items={items}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

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
