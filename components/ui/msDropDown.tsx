// Imports
// import PreviousMap from 'postcss/lib/previous-map';
import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';



// Props
type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: OptionType[]; // Change to OptionType[] for react-select compatibility
  selectedOptions: string[] | OptionType[]; // Change to OptionType[] for react-select compatibility
  onChange: (selected: OptionType[]) => void;
  placeholder?: string; // Optional placeholder prop
}




const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange, placeholder }) => {
  const [selected, setSelected] = useState<OptionType[]>([]);



  useEffect(() => {
    // Set initial selected options based on props
    const initialSelected = Array.isArray(selectedOptions)
      ? selectedOptions.map(option => (typeof option === 'string' ? { value: option, label: option } : option))
      : [];
    setSelected(initialSelected);
  }, [selectedOptions]);


  const handleChange = (selected: MultiValue<OptionType | string>) => {
    setSelected(selected as OptionType[]);
    onChange(selected as OptionType[]);
  };

  const handleDeselect = (option: OptionType) => {
    const updatedSelected = selected.filter(selectedOption => selectedOption.value !== option.value);
    setSelected(updatedSelected);
    onChange(updatedSelected);
  };

  return (
    <div className="flex space-x-8">

      <div className="flex flex-col w-1/2 p-4 border rounded-lg bg-gray-100">
        <Select
          isMulti
          options={options}
          value={selected}
          onChange={handleChange}
          placeholder={placeholder}
          styles={{
            menu: (base) => ({
              ...base,
              maxHeight: '200px',
              overflowY: 'auto',
              color: 'black',
            }),
          }}
          components={{
            MultiValue: () => null, // Prevents the bubbles from showing
            ClearIndicator: () => null, // Hides the clear indicator
          }}
        />
      </div>

      <div className="flex flex-col w-1/2 p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-center">Selected</h3>
        <ul className="space-y-2">
        {selected.map(option => (
            <li key={option.value} className="text-center">
              <button
                onClick={() => handleDeselect(option)}
                className="w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded hover:bg-red-100"
              >
                {option.label} {/* Display the label instead of the entire option */}
              </button>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};

export default MultiSelectDropdown;
