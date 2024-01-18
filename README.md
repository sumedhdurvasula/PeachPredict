# PeachPredict
This innovative housing price predictor leverages advanced machine learning techniques, specifically employing a Long Short-Term Memory (LSTM) model. Users can input property information alongside macro-economic indicators to receive accurate estimations. By combining various data points, including the unique capabilities of the LSTM model, it provides a comprehensive understanding of housing values across all Georgia counties. The application also includes embedded data visualization tools for easy feature comparison, empowering users to make informed decisions confidently. Its unique approach includes nuanced insights through feature weighting, ensuring precise estimations without focusing on specific property details.

# PeachPredict Demo
https://www.youtube.com/watch?v=a3dAYgmTvEo

# Link to PeachPredict 
https://peach-predict.vercel.app/

# More information
https://sites.google.com/view/peach-predict/home?authuser=0


# ETL Pipeline
### Dependencies:
#### Python Libraries:
1. pandas (`$ conda install -c anaconda pandas`)
2. numpy (`$ conda install -c anaconda numpy`)
3. pymongo (`$ conda install -c anaconda pymongo`)
4. full_fred (`$ pip install full-fred`)
5. beautifulsoup4 (`$ conda install -c anaconda beautifulsoup4`)
### Quickstart
Run `data/data.py`. To decide which parts of the pipeline runs, you need to change the values in params.json accordingly - reference next section for explanation on keys and values as well as pipline steps.
### Parameters & Explanation
The data pipeline has 3 steps:
1. Build a JSON-formatted key of each county's different series on FRED and the respective ids
2. Build a JSON-formatted key of each county's different series on FRED and the respective ids specifically for the baselines to bse used for predictions
3. Pull the specified series_ids from the FRED API and push them to our MongoDB database.
4. Fetch the specified data from the MongoDB database and store it in a local JSON file.
a. This JSON file called "data.json" is considered the consumption database.

The "dumps/params.json" file is where you can specify what counties are included, what series you want to grab, and which of the above steps you want to run. These parameters are specified as follows:

| Paramter Name | Values | Notes |
|-|-|-|
|`all_counties` | `["Appling", ...]`|A list of all counties in Georgia (should not be changed)
| `limit_counties` | `["Fulton", ...]` |A list of counties in Georgia that you want to keep
| `limit_counties-30` | `["Fulton", ...]` |A list of top 30 populated counties in Georgia
| `kept_series` | `["All-transactions...", ...]` |A list of the series that you want to keep (i.e. GDP, housing price index, etc.)
| `baselines` | `["All-transactions...", ...]` |A list of the series that you want to keep to use as baselines(i.e. housing price index, etc.)
| `limit_res` | `0 or 1` | 1 = True, 0 = False - THIS SHOULD NOT BE CHANGED AS OF NOW - limits the counties to selected ones and series to kept ones (as specified by above parameters) to handle database limitations
| `refresh_ids` | `0 or 1` | 1 = Perform step 1; 0 = Do not perform step 1 (see above for description on steps)
| `baseline_json` | `0 or 1` | 1 = Perform step 2; 0 = Do not perform step 2 (see above for description on steps)
| `push_data` | `0 or 1` |1 = Perform step 3; 0 = Do not perform step 3 (see above for description on steps)
| `local_store` | `0 or 1` | 1 = Perform step 4; 0 = Do not perform step 4 (see above for description on steps)

Note the default value for limit_res is 1 because our current database set up has certain technical limitations preventing us from having very large amounts of data. Furthermore, the default value for refresh_ids is 0 because scraping all ids is computationally expensive, and unncessary most of the time - having completely new series pop up in FRED is a very uncommon occurence; thus, our current key database (config/county_ids.json) is generally sufficient.

## API Starter Guide
Run `data/raw_api.py` to start Flask server on a local port.

## API Endpoints (Front-end) 


### POST /county-select

#### Description

Select a county to recieve a prediction for

#### Request
- **URL**: `http://127.0.0.1:5000/county-select/`
- **Method**: `POST`
##### Request Body
```json
{
    "county": "Forsyth" // Ensure it is a county that is 'selected'
}
```
### POST /county-select
#### Description
Select a county to recieve a prediction for
#### Request
- **URL**: `http://127.0.0.1:5000/feature-select/`
- **Method**: `POST`
##### Request Body
```json
{
    //Ensure they are indicators that are 'selected'
    "indicators": ["CPI", "GDP", ...] 
}
```


# Release Notes
## v0.4.0
### Features
**Feature Optimization Team**:
  - **Forecast Accuracy Visualization**: Implemented a feature for users to view prediction forecast accuracy upon selecting features (county, indicators) on the front-end.
  - **Enhanced Feature Selection**: Improved algorithm for picking prevalent features, considering user-selected indicators for more accurate forecasting.

**Hyperparameter Tuning Team**:
  - **Optimized Variable Date Ranges**: Developed a model to output predictions based on optimized variable date ranges, aiming for high accuracy.
  - **Model-Front-End-API Integration**: Ensured fluid interaction between the ML models, front-end, and API for a seamless user experience.

**Data Pipeline**:
  - **Local Data Access**: Facilitated easy access to formatted datasets locally, streamlining the process for developers.
  - **Dynamic Data Aggregation Update**: Refined the data aggregation process to be more adaptable and efficient for ML model inputs.

**Front-End Development**:
  - **Feature Interaction**: Updated front-end to properly select each county availble with data attached and allowed for indicator selection based on county selection. Allow for graph saving.
  - **UI/UX Enhancements**: Continued to refine the front-end interface to reflect back-end changes and improve user interaction. Changed capabilities of graph so the UI is more appealing to customers.

### Bug Fixes
- Fixed issues with model-data synchronization, ensuring that the selected features are accurately represented in the model's forecasts.
- Addressed the data formatting issues to enhance the cohesion between JSON, text documents, and the front-end display.

### Known Issues
- Some discrepancies in forecast accuracy when integrating new macro-economic variables. Further refinement is required.
- Only obtaining monthly tickers through Web Scraping is challenging
- Working on fine-tuning the date range selection in the UI to ensure it's intuitively linked with the forecast results.
