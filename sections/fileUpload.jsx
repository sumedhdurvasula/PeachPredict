import React, { useState, useRef } from 'react';
import './uploadfile.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelectDropdown from './select';
import About from './About'
import axios from 'axios'



function FileUploadBox() {
const [city, setCity] = useState('')
const [startDate, setStartDate] = useState('')
const [indicator, setIndicator] = useState([])
const childRef = useRef();

const updateIndicators = (selectedValues) => {
  setIndicator(selectedValues);
};

const handleSubmit = (e) => {
  e.preventDefault()
  const params = { city, startDate, indicator }
  const county = 'http://127.0.0.1:5000/county-select/' + params.city
  const selectedValues = indicator.map(item => item.value);
  console.log('Selected Indicators:', selectedValues);
  const indicatorsString = selectedValues.join(', ');
  console.log(params.city + params.startDate + " " + indicatorsString)
  axios
    .post(county, params.city)
    .then((res) => {
      alert(res.data.result)
      //reset()
    })
    .catch((error) => alert(`Error: ${error.message}`))
}


const reset = () => {
  setCity('')
  setStartDate('')
  setIndicator([])
  if (childRef.current && childRef.current.reset) {
    childRef.current.reset();
  }
}

  return (
    <div className="wrapper">
      <form onSubmit={(e) => handleSubmit(e)}>
      <header>Price Prediction</header>
        <div className="glass__form__group">
          <select
            id="City"
            className="glass__form__input"
            placeholder="Select City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            <option value="">Select County</option>
            <option value="Fulton">Fulton</option>
            <option value="DeKalb">DeKalb</option>
            <option value="Forsyth">Forsyth</option>
            <option value="Gwinnett">Gwinnett</option>
            <option value="Cobb">Cobb</option>
          </select>
        </div>
        <div className="glass__form__group">
        <label htmlFor="startDatePicker"></label>

        <DatePicker
        id="startDatePicker"
        selected={startDate}
        className = "glass__form__date"
        required
        onChange={e => setStartDate(e)}
        placeholderText="Select a Date"
        />
        </div>

        <div className="glass__form__group">
      <MultiSelectDropdown ref={childRef} onChange={updateIndicators} />
      </div>

          <div className="glass__form__group">
        <button type="submit" className="glass__form__btn" >
          Submit
        </button>
      </div>
    </form>

    <div className="button-container">
      <button type="reset" className="glass__form__reset" onClick={reset}>
        Reset
      </button>
      </div>
    </div>
  );
};

export default FileUploadBox;
