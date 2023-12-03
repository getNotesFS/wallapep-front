import {React, useState} from 'react';
import { Form, Input, Select, Typography } from 'antd';
import useDateHandler from '../../hooks/useDateHandler';
import useDateValidation from '../../hooks/useDateValidation';

const { Option } = Select;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const CustomDatePicker = ({ value = {}, onChange, validate }) => {
    const { date, handleDayChange, handleMonthChange, handleYearChange } = useDateHandler(value);
    const [touched, setTouched] = useState({
        day: false,
        month: false,
        year: false
    });
    const validationError = validate ? validate(date) : null;
    const errors = useDateValidation(date, touched);
    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };
    // Actualiza el estado local y notifica al formulario de cambios
    const triggerChange = (changedValue) => {
        onChange?.({
            ...date,
            ...changedValue,
        });
    };

    // Envoltorios para los manejadores de cambio que incluyen triggerChange
    const wrappedHandleDayChange = (e) => {
        // validar que sea numérico
         if(e.target.value.length > 1 && e.target.value < 1){
            return;
         }
        if (isNaN(e.target.value) || e.target.value > 31  ) {
            return;
        }

        handleDayChange(e.target.value);
        triggerChange({ day: e.target.value });
    };

    const wrappedHandleMonthChange = (value) => {

        handleMonthChange(value);
        triggerChange({ month: value });
    };

    const wrappedHandleYearChange = (e) => {

        if (isNaN(e.target.value) || (e.target.value.length > 1 && e.target.value < 19) || e.target.value.length == 1 && e.target.value < 1 ) {
            return;
        }
        handleYearChange(e.target.value);
        triggerChange({ year: e.target.value });
    };

    // Renderizado de errores
    const renderError = (error) => {
        if (!touched.day && !touched.month && !touched.year) {
            return null;
        }

         return error ? <Typography.Text type="danger">{error} /  </Typography.Text> : null;
    };

    return (
        <>
            <Input
                style={{ width: '100px', marginRight: '8px' }}
                placeholder="DD"
                maxLength={2}
                value={date.day}

                onBlur={() => handleBlur('day')}
                onChange={wrappedHandleDayChange}
            />
            <Select
                showSearch
                placeholder="Month"
                optionFilterProp="children"
                style={{ width: '120px', marginRight: '8px' }}
                value={date.month || 'MM'}
                onBlur={() => handleBlur('month')}
                onChange={wrappedHandleMonthChange}
            >
                {MONTH_NAMES.map((monthName, index) => (
                    <Option key={monthName} value={String(index + 1).padStart(2, '0')}>
                        {monthName}
                    </Option>
                ))}
            </Select>
            <Input
                style={{ width: '100px', marginRight: '8px' }}
                placeholder="YYYY"
                maxLength={4}
                value={date.year}
                onBlur={() => handleBlur('year')}
                onChange={wrappedHandleYearChange}
            />
            {renderError(errors.day)}
            {renderError(errors.month)}
            {renderError(errors.year)}
            {validationError && <Typography.Text type="danger">{validationError}</Typography.Text>}
        </>
    );
};

export default CustomDatePicker;