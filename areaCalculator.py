import pandas as pd
from math import cos, asin, sqrt
import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine

from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time

engine = engine = create_engine('postgresql://live_crimehtx:%7C_IVE_C%7C3IME_hTX001@crimehtxdb.c0fjj9b9p4wl.us-east-1.rds.amazonaws.com/crimehtxdb')
Base = declarative_base(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()

conn = session.bind

def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))

def closest(data, agora):
    return min(data, key=lambda p: distance(agora['lat'],agora['lon'],p['y'],p['x']))

def snbname(lat,lon):
    location = {'lat':float(lat), 'lon':float(lon)}
    df_t = pd.read_sql_query('Select y,x,snbname from crime09_15 limit 10000', engine)
    dict_incident = df_t.head().to_dict('records')
    return closest(dict_incident, location)

#print(snbname(29.801320485799998,-95.3223410668))

def buildCount(n):
    area = "\'"+n+"\'"
    print(area)
    query = (f"select * from regression_data where snbname = {area}")
    print(query)
    df_m = pd.read_sql_query(query, engine)
    df_m = df_m.sort_values('Hour')
    print('len: ' + str(len(df_m)))
    return df_m