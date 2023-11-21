import React, { useState, useRef } from 'react';
import './uploadfile.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelectDropdown from './select';
import About from './About'
import axios from 'axios'


function FileUploadBox({ onDataReady }) {
const [city, setCity] = useState('')
const [startDate, setStartDate] = useState('')
const [indicator, setIndicator] = useState([])
const childRef = useRef();
const [prediction, setPrediction] = useState(null);

const updateIndicators = (selectedValues) => {
  setIndicator(selectedValues);
};

const handleSubmit = async (e) => {
  e.preventDefault()
  const params = { city, startDate, indicator }
  const countyUrl = 'http://127.0.0.1:5000/county-select/' + params.city
  const selectedValues = indicator.map(item => item.value);
  console.log('Selected Indicators:', selectedValues);
  const indicatorsString = selectedValues.join(', ');
  console.log(params.city + params.startDate + " " + indicatorsString)
  try {
    // Use FormData to send parameters as part of the request
    const formData = new FormData();
    formData.append('city', params.city);
    formData.append('startDate', params.startDate);
    formData.append('indicators', indicatorsString);

    const response = await axios.post(countyUrl, formData, {
      responseType: 'arraybuffer', // Tell Axios to expect binary data
    });

    // Convert the received binary data to a data URL
    const imageUrl = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    setPrediction(imageUrl);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}


const reset = () => {
  setCity('')
  setStartDate('')
  setIndicator([])
  if (childRef.current && childRef.current.reset) {
    childRef.current.reset();
  }
  setPrediction(null)
}
      //const newPrediction = res.data.result;
      //console.log(newPrediction); // Logs the received data
      //setPrediction(newPrediction); // Asynchronous state update
      //onDataReady(newPrediction);
      //reset()

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
    <div>
      {prediction && <img src={prediction} alt="Generated Graph" />}
    </div>
    </div>
  );
};

export default FileUploadBox;
