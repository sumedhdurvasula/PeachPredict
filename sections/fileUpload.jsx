import React, { useState, useRef } from 'react';
import './uploadfile.css';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelectDropdown from './select';
import About from './About'
import axios from 'axios'

function FileUploadBox({ onDataReady }) {
const [city, setCity] = useState('')
const [time, setTime] = useState('')
//const [startDate, setStartDate] = useState('')
const [indicator, setIndicator] = useState([])
const childRef = useRef();
const [prediction, setPrediction] = useState(null);
const [loading, setLoading] = useState(false);

const updateIndicators = (selectedValues) => {
  setIndicator(selectedValues);
};

const openImageInNewTab = () => {
  if (prediction) {
    const newTab = window.open();
    newTab.document.write(`
      <html>
        <head>
          <title>Generated Graph</title>
          <style>
            body {
              background-color: #242839;
            }
          </style>
        </head>
        <body>
          <img src="${prediction}" alt="Generated Graph">
        </body>
      </html>
    `);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true);
  const params = { city, indicator, time }
  const countyUrl = 'https://getsgraph-geftptehla-uk.a.run.app/county-select/' + params.city
  const selectedValues = indicator.map(item => item.value);
  const indicatorsString = selectedValues.join(', ');
  try {
    // Use FormData to send parameters as part of the request
    const formData = new FormData();
    formData.append('city', params.city);
    formData.append('indicators', indicatorsString);
    formData.append('time', params.time)

    const response = await axios.post(countyUrl, formData, {
      responseType: 'arraybuffer', // Tell Axios to expect binary data
    });

    // Convert the received binary data to a data URL
    const imageUrl = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    setPrediction(imageUrl);
  } catch (error) {
    alert(`Error: Please Choose Another County`);
  } finally {
    // Set loading back to false after the request is completed
    setLoading(false);
  }
}

const generateOptions = () => {
  const options = [<option key="" value="">Select time range (months)</option>];

  for (let i = 3; i <= 36; i += 3) {
    options.push(<option key={i} value={i}>{i}</option>);
  }

  return options;
};


const reset = () => {
  setCity('')
  setIndicator([])
  setTime('')
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
            <option value="Fulton">Fulton</option>
            <option value="Glynn">Glynn</option>
            <option value="Gordon">Gordon</option>
            <option value="Gwinnett">Gwinnett</option>
            <option value="Hall">Hall</option>
            <option value="Henry">Henry</option>
            <option value="Houston">Houston</option>
            <option value="Jackson">Jackson</option>
            <option value="Jefferson">Jefferson</option>
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
      {city && (
        <select
          id="City"
          className="glass__form__input"
          placeholder="Select time range (months)"
          required
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ color: 'white', fontWeight: 'bold' }}
        >
          {generateOptions()}
        </select>
      )}
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
      {loading ? (
        // Display the loading spinner
        <div className="loader"></div>
      ) : (
        // Display the image when available
        prediction && (
          <div>
            <img
              src={prediction}
              alt="Generated Graph"
              onClick={openImageInNewTab}
              style={{ cursor: 'pointer' }}
              className="enlarge-on-hover"
            />
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
              Click on image to open in a new tab or hover to enlarge
            </div>
          </div>
        )
      )}
    </div>
   </div>
  );
};

export default FileUploadBox;
