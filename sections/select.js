import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Select from 'react-select';

const options = [
  { value: 'GDP', label: 'GDP' },
  { value: 'Income', label: 'Income' },
  { value: 'Interest Rates', label: 'Interest Rates' },
  { value: 'Home Sales', label: 'Home Sales' },
  { value: 'Home Building', label: 'Home Building' }
];

const MultiSelectDropdown = forwardRef(({ onChange }, ref) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (selectedValues) => {
    setSelectedValues(selectedValues);

    onChange(selectedValues);
  };

  const reset = () => {
    setSelectedValues([]);
  };

  useImperativeHandle(ref, () => ({
    reset: reset,
  }));

  const colourStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: 'transparent',
      backdropFilter: 'blur(10px)',
      border: 'none',
      borderRadius: '3px',
      padding: '1px',
      width: '100%',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)'
    }),
    multiValue: (provided, state) => ({
        ...provided,
        backgroundColor: '#62cbc9',
        borderRadius: '3px',
        padding: '2px 6px',
        color: '#fff',
        fontWeight: 'bold'
      }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled ? 'red' : 'transparent', // Adjust colors as needed
          color: '#000',
          cursor: isDisabled ? 'not-allowed' : 'default',
          fontFamily: 'Arial, sans-serif',  // Change the font family
          fontSize: '14px'  // Change the font size
        };
      },
      indicatorSeparator: () => ({
        display: 'none'
      }),
    placeholder: (styles) => ({
        ...styles,
        color: 'white',
        fontWeight: 'bold'
      })
    };

  return (

    <Select
      value={selectedValues}
      onChange={handleChange}
      options={options}
      isMulti
      required
      styles={colourStyles}
      placeholder="Select Macroeconomic Indicator(s)"
      closeMenuOnSelect = {false}
    />
  );
});

export default MultiSelectDropdown;