// imports
import React, { useEffect, useState } from 'react';


// Props
interface ShuttleProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}


const Shuttle: React.FC<ShuttleProps> = ({ options, selectedOptions, onChange }) => {
  const [availableOptions, setAvailableOptions] = useState<string[]>(options);
  const [selected, setSelected] = useState<string[]>(selectedOptions);



  useEffect(() => {
    // handle the exchanging of variables between the lists
    setAvailableOptions(options.filter(option => !selected.includes(option)));
  }, [options, selected]);



  // selecting and deselecting (handle in this component and the main page)
  const handleSelect = (option: string) => {
    setSelected(prev => [...prev, option]);
    onChange([...selected, option]);
  };

  const handleDeselect = (option: string) => {
    const newSelected = selected.filter(item => item !== option);
    setSelected(newSelected);
    onChange(newSelected);
  };



  return (
    <div className="flex space-x-8">


      {/* Available Options */}
      <div className="flex flex-col w-1/2 p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-center">Available</h3>
        <ul className="space-y-2 max-h-52 overflow-y-scroll">
          {availableOptions.map(option => (
            <li key={option} className="text-center">
              <button
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded hover:bg-blue-100"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>


      {/* Selected Options */}
      <div className="flex flex-col w-1/2 p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-center">Selected</h3>
        <ul className="space-y-2">
          {selected.map(option => (
            <li key={option} className="text-center">
              <button
                onClick={() => handleDeselect(option)}
                className="w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded hover:bg-red-100"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};

export default Shuttle;
