import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import styles from "../AdminServices/AdminServices.module.scss"
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminServices = ({ categoriesOptions, idCategorie , servicios}) => {
  const REACT_APP_API_URL = import.meta.env.VITE_BASE_URL;
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

  const defaultOptions = categoriesOptions ? categoriesOptions.map(option => createOption(option.description)) : [];

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState(null);
  const labelToSend = value && value.label;

  useEffect(() => {
    if (value !== null && !defaultOptions.some(option => option.label === value.label)) {
      setIsLoading(false);
     axios.post(`${REACT_APP_API_URL}/categories/options`, {
        "idCategorie": idCategorie,
        "description": labelToSend
      });
    }
  }, [value, options]);

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    setValue(newOption);
    setIsLoading(false);
  };
 
  
  function findIdOption(idCategorie, labelToSend, servicios) {
    const category = servicios.find(cat => cat.idCategorie === idCategorie);
    if (category) {
        const service = category.categories_options.find(opt => opt.description === labelToSend);
        if (service) {
            return service.idOption;
        } 
    } 
    return null;
}

const handleDelete = async () => {
  const idOption = findIdOption(idCategorie, labelToSend, servicios);
  const data ={idOption: idOption}
  try {
    const deleted = await axios.delete(`${REACT_APP_API_URL}/categories/options`, {data});
  } catch(error){
    Swal.fire({
      title: `Debes seleccionar un elemento para Eliminar`,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
};

  return (
    <div className={styles.container}>
      
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={(newValue) => setValue(newValue)}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        placeholder={""}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width: "900px",
            fontSize: state.isFocused ? "x-large" : "x-large",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 10,
          colors: {
            ...theme.colors,

            primary25: '#d9d8d8',
            primary: '#c47c52',
          },
        })}
      />
      <button onClick={handleDelete} value={idCategorie}>Delete</button>
    </div>
  );
};

export default AdminServices;