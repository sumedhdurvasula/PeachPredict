import React, { useState, useRef } from 'react';
import './uploadfile.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelectDropdown from './select';
import About from './About'
import axios from 'axios'


function FileUploadBox({ onDataReady }) {
const [city, setCity] = useState('')
//const [startDate, setStartDate] = useState('')
const [indicator, setIndicator] = useState([])
const childRef = useRef();
const [prediction, setPrediction] = useState(null);

const updateIndicators = (selectedValues) => {
  setIndicator(selectedValues);
};

const handleSubmit = async (e) => {
  e.preventDefault()
  const params = { city, indicator }
  const countyUrl = 'http://127.0.0.1:5000/county-select/' + params.city
  const selectedValues = indicator.map(item => item.value);
  console.log('Selected Indicators:', selectedValues);
  const indicatorsString = selectedValues.join(', ');
  console.log(params.city + " " + indicatorsString)
  try {
    // Use FormData to send parameters as part of the request
    const formData = new FormData();
    formData.append('city', params.city);
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
            <option value="Barrow">Barrow</option>
            <option value="Bartow">Bartow</option>
            <option value="Bibb">Bibb</option>
            <option value="Bulloch">Bulloch</option>
            <option value="Calhoun">Calhoun</option>
            <option value="Camden">Camden</option>
            <option value="Carroll">Carroll</option>
            <option value="Catoosa">Catoosa</option>
            <option value="Chatham">Chatham</option>
            <option value="Cherokee">Cherokee</option>
            <option value="Clarke">Clarke</option>
            <option value="Clayton">Clayton</option>
            <option value="Cobb">Cobb</option>
            <option value="Columbia">Columbia</option>
            <option value="Coweta">Coweta</option>
            <option value="DeKalb">DeKalb</option>
            <option value="Dougherty">Dougherty</option>
            <option value="Douglas">Douglas</option>
            <option value="Effingham">Effingham</option>
            <option value="Fayette">Fayette</option>
            <option value="Floyd">Floyd</option>
            <option value="Forsyth">Forsyth</option>
            <option value="Fulton">Fulton</option>
            <option value="Glynn">Glynn</option>
            <option value="Gordon">Gordon</option>
            <option value="Gwinnett">Gwinnett</option>
            <option value="Hall">Hall</option>
            <option value="Henry">Henry</option>
            <option value="Houston">Houston</option>
            <option value="Jackson">Jackson</option>
            <option value="Jefferson">Jefferson</option>
            <option value="Laurens">Laurens</option>
            <option value="Liberty">Liberty</option>
            <option value="Lowndes">Lowndes</option>
            <option value="Macon">Macon</option>
            <option value="Muscogee">Muscogee</option>
            <option value="Newton">Newton</option>
            <option value="Paulding">Paulding</option>
            <option value="Richmond">Richmond</option>
            <option value="Rockdale">Rockdale</option>
            <option value="Spalding">Spalding</option>
            <option value="Troup">Troup</option>
            <option value="Walker">Walker</option>
            <option value="Walton">Walton</option>
            <option value="Whitfield">Whitfield</option>
          </select>
        </div>

        <div className="glass__form__group">
        {city && <MultiSelectDropdown ref={childRef} onChange={updateIndicators} />}
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
