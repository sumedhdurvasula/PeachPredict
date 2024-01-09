import json
import datetime
import pandas as pd
import numpy as np
import pandas_datareader as pdr
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import tempfile

#LSTM Model Imports
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

#Sklearn Imports
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression

def model_graph(county, forecast_months):
    forecast_months = int(forecast_months)
    #Variables that can be changed to adjust the accuracy of the model

    #Start and end date of the data to be extracted from FRED
    start = datetime.datetime(2007, 1, 1)
    end = datetime.datetime(2023, 1, 1)

    #Weight used for peak ranges, higher peak range value takes the range more into consideration
    peak_range_weight = 2.0
    normal_range_weight = 1.0


    #Parameters used to tune the LSTM machine learning model
    train_size = 0.8
    look_back = 3
    number_of_neurons = 50
    number_of_epochs = 15
    model_batch_size = 1
    model_verbose = 1
    model_loss_type = 'mean_squared_error'
    model_optimizer_type = 'adam'


    #Variables to be extracted from the json file
    identifiers = []
    titles = []
    start_dates = []
    end_dates = []

    #Extracting data from the json file
    with open("output.json", "r") as json_file:
        data = json.load(json_file)

    start_dates.append(start)
    end_dates.append(end)

    #Adding the data to their respective storing data structures
    for i, (identifier, info) in enumerate(data.items()):
        identifiers.append(identifier)
        titles.append(info["title"])

        if i == 0:
            target_title = info["title"]
            break

        start_date_str = info["peak_ranges"][0]["start_date"]
        end_date_str = info["peak_ranges"][0]["end_date"]
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d")

        start_dates.append(start_date)
        end_dates.append(end_date)
    #Helper methods used for different parts of the ML model

    #Function used to fill out the missing data with linear regression
    def fill_missing_with_linear_regression(series):
        series_copy = series.copy()

        non_nan_indices = np.where(~np.isnan(series_copy))[0]
        nan_indices = np.where(np.isnan(series_copy))[0]
        if len(nan_indices) > 0 and len(non_nan_indices) >= 2:
            X = non_nan_indices.reshape(-1, 1)
            y = series_copy.iloc[non_nan_indices]
            model = LinearRegression()
            model.fit(X, y)
            predicted_values = model.predict(np.array(nan_indices).reshape(-1, 1))
            series_copy.iloc[nan_indices] = predicted_values

        return series_copy

    #Function used to apply the weights of the peak and regular ranges
    def apply_custom_weights(series, start_date, end_date, high_weight, normal_weight):
        weights = [high_weight if start_date <= date <= end_date else normal_weight for date in monthly_df["DATE"]]
        return series.multiply(weights)


    #Preparing the data for time series forecasting
    def create_dataset_multi(X, Y, look_back=1):
        dataX, dataY = [], []
        for i in range(len(X) - look_back):
            a = X[i:(i + look_back), :]
            dataX.append(a)
            dataY.append(Y[i + look_back, 0])
        return np.array(dataX), np.array(dataY)

    # Defining the DataFrame with all the identifiers extracted from the JSON file
    merged_df = pd.DataFrame()

    for identifier in identifiers:
        df = pdr.DataReader(identifier, 'fred', start, end)
        merged_df = pd.concat([merged_df, df], axis=1)

    merged_df.columns = titles

    # Resample the DataFrame to get the first observation of each month
    monthly_df = merged_df.resample('MS').first()

    # Fill out the missing data with linear regression
    for col in monthly_df.columns:
        monthly_df[col] = fill_missing_with_linear_regression(monthly_df[col])

    monthly_df.reset_index(inplace=True)

    #Apply the weights of the peak and regular ranges
    for idx, title in enumerate(titles[0:-1]):
        start_date = start_dates[idx]
        end_date = end_dates[idx]
        monthly_df[title] = apply_custom_weights(monthly_df[title], start_date, end_date, peak_range_weight, normal_range_weight)

    input_data = monthly_df.drop(["DATE"], axis=1).values
    first_column = input_data[:, 0].reshape(-1, 1)
    input_data = np.hstack((input_data * 0.35, first_column))

    #Target value we are trying to forecast
    target_data = monthly_df[target_title].values.reshape(-1, 1)

    #Scaling/Normalizing the data to be used for the LSTM model
    input_scaler = MinMaxScaler(feature_range=(0, 1))
    input_scaled = input_scaler.fit_transform(input_data)
    target_scaler = MinMaxScaler(feature_range=(0, 1))
    target_scaled = target_scaler.fit_transform(target_data)

    #Creating datasets suitable for training LSTM model
    X, Y = create_dataset_multi(input_scaled, target_scaled, look_back)

    #Diving the datasets into a training and testing dataset
    X_train, X_test = X[0: int(len(X) *train_size)], X[int(len(X) *train_size):]
    Y_train, Y_test = Y[0: int(len(Y) *train_size)], Y[int(len(Y) *train_size):]

    model = Sequential()
    model.add(LSTM(number_of_neurons, input_shape=(look_back, input_data.shape[1])))
    model.add(Dense(1))
    model.compile(loss= model_loss_type, optimizer= model_optimizer_type)
    model.fit(X_train, Y_train, epochs=number_of_epochs,
            batch_size= model_batch_size, verbose= model_verbose)

    train_predict = model.predict(X_train)
    test_predict = model.predict(X_test)

    #Descaling/Denormalizing the data so it can be understood by human users
    train_predict = target_scaler.inverse_transform(train_predict)
    Y_train = target_scaler.inverse_transform([Y_train])
    test_predict = target_scaler.inverse_transform(test_predict)
    Y_test = target_scaler.inverse_transform([Y_test])

    X_train, X_test = X[0: int(len(X) *train_size)], X[int(len(X) *train_size):]
    Y_train, Y_test = Y[0: int(len(Y) *train_size)], Y[int(len(Y) *train_size):]
    model2 = Sequential()
    model2.add(LSTM(number_of_neurons, input_shape=(look_back, input_data.shape[1])))
    model2.add(Dense(forecast_months))
    model2.compile(loss= model_loss_type, optimizer= model_optimizer_type)
    model2.fit(X_train, Y_train, epochs=5,
            batch_size= model_batch_size, verbose= model_verbose)
    # Generate the Forecasts
    X_last = input_scaled[-look_back:]  # Get the last 'look_back' months
    X_last = X_last.reshape(1, look_back, input_data.shape[1])

    future_predict = model2.predict(X_last).reshape(-1, 1)
    future_predict = target_scaler.inverse_transform(future_predict)

    # Prepare the Data for Plotting
    future_dates = pd.date_range(start=monthly_df['DATE'].iloc[-1] + pd.offsets.MonthBegin(1), periods= forecast_months, freq='MS')
    df_future = pd.DataFrame({'DATE': future_dates, 'Forecast': future_predict.flatten()})

    #Visualizing the forecasting of the LSTM model
    plt.figure(figsize=(15,6), facecolor = '#242839')

    #Defining the target data and forcasted data time axes
    time_axis = [i for i in range(len(target_data))]
    train_time_axis = [i + look_back for i in range(len(train_predict))]
    test_time_axis = [i + len(train_predict) + look_back for i in range(len(test_predict))]
    #Calculate the years for the y-axis ticks
    years = pd.date_range(start=start, end=end, freq='Y')

    ax = plt.axes()

    ax.set_facecolor('#CDC1AE')
    #ax.set_facecolor((1.0, 0.47, 0.42))

    #Ploting the target data and the predicted value of the target data
    plt.plot(monthly_df['DATE'], target_data, label="Actual " + county +" Home Price Index", color='blue')
    plt.plot(monthly_df['DATE'][0: int(len(X) *train_size)], train_predict, label="Train predictions", color='red')
    plt.plot(monthly_df['DATE'][int(len(X) *train_size) + 3:], test_predict, label="Test predictions", color='green')
    plt.plot(df_future['DATE'], future_predict, label="Forecast", color='black', linestyle='--')

    train_end_idx = int(len(X) * train_size) - 1
    test_start_idx = int(len(X) * train_size) + 3

    # Extract the dates for the connecting points
    train_end_date = monthly_df['DATE'][train_end_idx]
    test_start_date = monthly_df['DATE'][test_start_idx]

    # Extract the prediction values for the connecting points
    train_end_value = train_predict[-1]
    test_start_value = test_predict[0]

    # Plot the connecting line
    plt.plot([train_end_date, test_start_date], [train_end_value, test_start_value], color='red')

    if len(test_predict) > 0 and len(future_predict) > 0:
        last_test_point_x = monthly_df['DATE'][int(len(X) * train_size) + 3 + len(test_predict) - 1]
        last_test_point_y = test_predict[-1]

        first_future_point_x = df_future['DATE'][0]
        first_future_point_y = future_predict[0]

        # Draw a line between these points
        plt.plot([last_test_point_x, first_future_point_x], [last_test_point_y, first_future_point_y], color='black', linestyle='--')

    # Adjust the y-axis ticks and labels to display years
    plt.xticks(color = "white")
    plt.yticks(color = "white")

    #Defining the title, xlabel, ylabel, and legend of the model
    plt.title("Actual vs. Predicted " + county+ " Home Price Index", color = "white")
    plt.xlabel("Time(years)", color = "white")
    plt.ylabel(county + " Home Price Index", color = "white")
    plt.legend()

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        graph_filename = temp_file.name
        plt.savefig(graph_filename, format='png')
    plt.close()
    return graph_filename
