import sqlalchemy
from sqlalchemy import create_engine
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression


engine = create_engine('postgresql://live_crimehtx:|_IVE_C|3IME_hTX001@crimehtxdb.c0fjj9b9p4wl.us-east-1.rds.amazonaws.com/crimehtxdb')

latSelect = 29.744046
longSelect = -95.402562
threshold = 0.005

df = pd.read_sql_query(f'SELECT * FROM crime09 WHERE (x > ({longSelect} - {threshold})) AND (x < ({longSelect} + {threshold})) AND (y > ({latSelect} - {threshold})) AND (y < ({latSelect} + {threshold}))', engine)

def sev(row):
    if row['offencetype'] == 'Aggravated Assault':
        val = 1
    elif row['offencetype'] == 'Rape':
        val = 1
    elif row['offencetype'] == 'Murder':
        val = 1
    elif row['offencetype'] == 'Robbery':
        val = 1
    elif row['offencetype'] == 'Arson':
        val = 0
    elif row['offencetype'] == 'Burglary':
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

nextSix(currentHour)

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

# print(futureCrime)
# print(fulltimefuture)

finalList = []
def Values():
    finalList.append(fulltimefuture)
    finalList.append(futureCrime)
    return(finalList)

