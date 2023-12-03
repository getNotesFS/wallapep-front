import React from 'react';
import {Select} from 'antd';
import countries from '../../data/countries';



const { Option } = Select;

// Use the onChange prop passed from the parent component, remove the inner declaration
const CountrySelector = ({ onChange, value }) => {
    const onSearch = (val) => {
        console.log('search:', val);
    };

    return (
        <Select
            showSearch
            placeholder="Select a country"
            optionFilterProp="title"
            onChange={onChange} // Use the onChange prop directly
            onSearch={onSearch}
            value={value} // Controlled component with value
            filterOption={(input, option) =>
                option?.title.toLowerCase().includes(input.toLowerCase())
            }
        >
            {countries.map((country) => (
                <Option key={country.value} value={country.label} title={country.label}>
                    <img
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.value}.svg`}
                        alt={country.label}
                        style={{ width: '20px', marginRight: '10px' }}
                    />
                    {country.label}
                </Option>
            ))}
        </Select>
    );
};

export default CountrySelector;
