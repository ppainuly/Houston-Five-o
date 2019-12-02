import sqlalchemy
from sqlalchemy import create_engine
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression


engine = create_engine('postgresql://live_crimehtx:|_IVE_C|3IME_hTX001@crimehtxdb.c0fjj9b9p4wl.us-east-1.rds.amazonaws.com/crimehtxdb')

finalList = []

def Locator(lat, lon):
    latSelect = lat #29.744046
    longSelect = lon #-95.402562
    threshold = 0.005

    case_hour = """case hour
    when '00' THEN 0
    when '0' THEN 0
    when '0.0' THEN 0
    when '''00' THEN 0 
    when '1' THEN 1
    when '01' THEN 1
    when '1.0' THEN 1
    when '''01' then 1 
    when '2' THEN 2
    when '02' THEN 2
    when '2.0' THEN 2
    when '''02' then 2 
    when '3' THEN 3
    when '03' THEN 3
    when '3.0' THEN 3
    when '''03' then 3 
    when '4' THEN 4
    when '04' THEN 4
    when '4.0' THEN 4
    when '''04' then 4 
    when '5' THEN 5
    when '05' THEN 5
    when '5.0' THEN 5
    when '''05' then 5 
    when '6' THEN 6
    when '06' THEN 6
    when '6.0' THEN 6
    when '''06' then 6 
    when '7' THEN 7
    when '07' THEN 7
    when '7.0' THEN 7
    when '''07' then 7 
    when '8' THEN 8
    when '08' THEN 8
    when '8.0' THEN 8
    when '''08' then 8 
    when '9' THEN 9
    when '09' THEN 9
    when '9.0' THEN 9
    when '''09' then 9
    when '10' THEN 10
    when '010' THEN 10
    when '10.0' THEN 10
    when '''10' then 10
    when '11' THEN 11
    when '011' THEN 11
    when '11.0' THEN 11
    when '''11' then 11
    when '12' THEN 12
    when '012' THEN 12
    when '12.0' THEN 12
    when '''12' then 12
    when '13' THEN 13
    when '013' THEN 13
    when '13.0' THEN 13
    when '''13' then 13
    when '14' THEN 14
    when '014' THEN 14
    when '14.0' THEN 14
    when '''14' then 14
    when '15' THEN 15
    when '015' THEN 15
    when '15.0' THEN 15
    when '''15' then 15
    when '16' THEN 16
    when '016' THEN 16
    when '16.0' THEN 16
    when '''16' then 16
    when '17' THEN 17
    when '017' THEN 17
    when '17.0' THEN 17
    when '''17' then 17
    when '18' THEN 18
    when '018' THEN 18
    when '18.0' THEN 18
    when '''18' then 18
    when '19' THEN 19
    when '019' THEN 19
    when '19.0' THEN 19
    when '''19' then 19
    when '20' THEN 20
    when '020' THEN 20
    when '20.0' THEN 20
    when '''20' then 20
    when '21' THEN 21
    when '021' THEN 21
    when '21.0' THEN 21
    when '''21' then 21
    when '22' THEN 22
    when '022' THEN 22
    when '22.0' THEN 22
    when '''22' then 22
    when '23' THEN 23
    when '023' THEN 23
    when '23.0' THEN 23
    when '''23' then 23
    when '24' THEN 24
    when '024' THEN 24
    when '24.0' THEN 24
    when '''24' then 24
    else 999
    end as hour"""

    df = pd.read_sql_query(f'SELECT x, y, date, offensetype, beats, {case_hour} FROM crime09_15 WHERE (x > ({longSelect} - {threshold})) AND (x < ({longSelect} + {threshold})) AND (y > ({latSelect} - {threshold})) AND (y < ({latSelect} + {threshold}))', engine)

    def sev(row):
        if row['offensetype'] == 'Aggravated Assault':
            val = 1
        elif row['offensetype'] == 'Rape':
            val = 1
        elif row['offensetype'] == 'Murder':
            val = 1
        elif row['offensetype'] == 'Robbery':
            val = 1
        elif row['offensetype'] == 'Arson':
            val = 0
        elif row['offensetype'] == 'Burglary':
            val = 0
        else:
            val = 0
        return val

    df['Severity'] = df.apply(sev, axis=1)

    df['date'] = pd.to_datetime(df['date'])

    df['Year'] = df['date'].dt.year
    df['Month'] = df['date'].dt.month
    df['Day'] = df['date'].dt.day
    df['Weekday'] = df['date'].dt.dayofweek

    df['hour']=df['hour'].astype(int)

    # Creat function to calculate max and min of crime severity
    def whatevs(df):
        crime_max = df.Severity.max()
        crime_min = df.Severity.min()
        crime_rng = crime_max - crime_min
        crime_low = crime_min/crime_rng
        crime_high = (.5 - crime_max)/crime_rng
        crime_list = [crime_low, crime_high]
        return crime_list


    hour_df = pd.DataFrame(df.groupby('hour')['Severity'].mean())

    L = whatevs(hour_df)[0]
    H = whatevs(hour_df)[1]

    # hour_df.style.background_gradient(cmap='RdYlGn_r',low=L, high=H)

    hour = hour_df.reset_index()

    X = hour.hour.values.reshape(-1, 1)
    y = hour.Severity.values.reshape(-1, 1)

    model = LinearRegression()

    model.fit(X, y)

    x_min = np.array([[X.min()]])
    x_max = np.array([[X.max()]])
    # print(f"Min X Value: {x_min}")
    # print(f"Max X Value: {x_max}")


    # Calculate the y_min and y_max using model.predict and x_min and x_max
    y_min = model.predict(x_min)
    y_max = model.predict(x_max)

    # Plot the model fit line using [x_min[0], x_max[0]], [y_min[0], y_max[0]]
    # plt.scatter(X, y, c='blue')
    # plt.plot([x_min[0], x_max[0]], [y_min[0], y_max[0]], c='red')

    now = datetime.now()
    currentHour = int(now.strftime("%H")) - 1
    nextSixHours = []

    def nextSix(hour):
        for i in range(6):
            nextHour = hour + 1 + i
            if nextHour > 23:
                newHour = nextHour - 24
                nextSixHours.append(newHour)
            else:
                nextSixHours.append(nextHour)
        return nextSixHours

    nextSixHours = nextSix(currentHour)

    fulltimefuture = []

    for t in range(6):
        future = datetime.now() + timedelta(hours= (t+1))
        formatted = format(future, '%Y-%m-%d %H:00:00')
        fulltimefuture.append(formatted)

    futureCrime = []

    for h in nextSixHours:
        predictedCrime = model.predict([[h]])
        prediction = round(predictedCrime[0][0], 4)
        futureCrime.append(prediction)

    finalList.append(fulltimefuture)
    finalList.append(futureCrime)
    return(finalList)

# print(futureCrime)
# print(fulltimefuture)

# print(Locator(29.744046, -95.402562))


# def Values(lat, lon):
#     finalList.append(fulltimefuture)
#     finalList.append(futureCrime)
#     return(finalList)

