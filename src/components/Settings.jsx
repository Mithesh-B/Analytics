import React, { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'
import './settings.scss'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setDateRange } from '../dateRangeSlice';


function Settings({hideButtons}) {


  const [datePicker, setDatePicker] = useState([]);
  const dispatch = useDispatch();
  //format date and dispatch it with redux
  const handleDateRangeChange = (value) => {
    setDatePicker(value);
    const startDate = moment(value[0]).format('YYYY-MM-DD');
    const endDate = moment(value[1]).format('YYYY-MM-DD');
    dispatch(setDateRange({ startDate, endDate }));
  };

  return (
    <div className='header'>
      <div className='settings'>
        <div className="left">
          <div className="datepicker">
              <DateRangePicker 
                placeholder="Select Date Range"
                value={datePicker} 
                onChange={handleDateRangeChange}
                format="LLL dd, yyyy" />
          </div>
        </div>
        <div className="right">
        <button onClick={hideButtons}>
          <img className='settingIcon' src="./settings.png" alt="icon" />
        Settings
        </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;