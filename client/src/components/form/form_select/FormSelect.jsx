import React, { useEffect, useState } from 'react';
import "./FormSelect.scss";

const FormSelect = (props) => {
    
    const { label, onChange, id, opts,  ...SelectProps } = props;

    return (
        <div className="formSelect">
            {label && <label>{label}</label>}
            <select
            
                {...SelectProps}
                onChange={onChange}
            >
                {opts.map((opt) => (

                    <option key={opt.id} value={opt.name}>{opt.value ? opt.value : opt.name}</option>
                ))}
            </select>

        </div>
    );
};

export default FormSelect;
