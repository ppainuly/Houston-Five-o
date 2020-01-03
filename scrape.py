import json
from splinter import Browser
from pprint import pprint
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import requests
import pandas as pd
from bs4 import BeautifulSoup
from urllib.request import urlopen
import sys
import pymongo
import time
import re
from urllib.parse import urlparse

#Set up Mongo
#db name: heroku_jq1zsq2q
# db user : livecrime_user

uri = "mongodb://livecrime_user:track#txN0W@ds137498.mlab.com:37498/heroku_jq1zsq2q?retryWrites=false"
client = pymongo.MongoClient(uri)
db = client.heroku_jq1zsq2q




def execute_hpdtraffic():

    # Set up url
    url = 'https://cohweb.houstontx.gov/ActiveIncidents/Combined.aspx?agency=P'
    html = requests.get(url,timeout=5)
    #col_names = ['Address','Cross Street','Key Map','Call Time(Opened)','Incident Type','Combined Response']
    address = []
    cross = []
    keymap = []
    time = []
    incident_type = []
    response = []
    lat = []
    lon = []

    # Reading the html page
    soup = BeautifulSoup(html.text, "html.parser")

    #Get id for the table
    tbody = soup.find(id="GridView2")

    #tbody.find('tr').find('th').text
    tag = tbody.findAll('tr')[1:]

    for tr in tag:
        print('*******')
        print(tr.find_all('td')[0].text)
        address.append(tr.find_all('td')[0].text)
        print('*******')
        print(tr.find_all('td')[1].text)
        cross.append(tr.find_all('td')[1].text)
        print('*******')
        print(tr.find_all('td')[2].text)
        keymap.append(tr.find_all('td')[2].text)
        print('*******')
        print(tr.find_all('td')[3].text)
        time.append(tr.find_all('td')[3].text)
        print('*******')
        print(tr.find_all('td')[4].text)
        incident_type.append(tr.find_all('td')[4].text)
        print('*******')
        print(tr.find_all('td')[5].text)
        response.append(tr.find_all('td')[5].text)
        print('*******')

        print('-------- NEXT TAG --------')

    #Create a new dataframe
    df = pd.DataFrame({'Address':address,'Cross_Street':cross,'Keymap':keymap,'Time':time,'Incident_Type':incident_type,'Response':response} )

    #Remove blanks from the df
    df_new = df[df["Address"] != '\xa0']

    #Create a list that will store location co-ordinates
    location = []

    #Loop to create co-ordinates based on address
    for x in range(0,len(df_new)):
        try:
            print(df['Address'][x])
            row = requests.get('https://nominatim.openstreetmap.org/search?q='+ df['Address'][x] + ',Houston,Tx&format=json')
            lat.append(row.json()[0]['lat'])
            lon.append(row.json()[0]['lon'])
            location.append([row.json()[0]['lat'],row.json()[0]['lon']])
            print('-----APPEND DONE------')
        except:
            lat.append('')
            lon.append('')
            location.append('')
            pass

    df_new['location'] = location
    df_new['lat'] = lat
    df_new['lon'] = lon

    #Remove rows with empty location data
    df_new = df_new[(df_new['lat']!= '') & (df_new['lon']!= '')]
    #df_new.to_csv('data/live_incidents_raw.csv',index=False)
    
    #Insert to Crimetracker collection(collection with all data)
    db.crimetracker.drop()
    df_crimedata = df_new.to_dict('records')
    crimetracker = db['crimatracker']
    crimetracker.insert_many(df_crimedata)
    pprint(df_crimedata)
    


    #Creating a new JSON for livedata collection(Needs four fields - location, type, address, time)
    df_live = pd.DataFrame({'location':df_new["location"], 'time':df_new["Time"], 
                        'type':df_new["Incident_Type"], 'address':df_new["Address"]})

    #df_live.to_csv('data/live_incidents.csv',index=False)

    # Creating JSON for the new df
    dfs_dict = df_live.to_dict('records')
    pprint(dfs_dict)

    #Empty livedata table
    db.livedata.drop()

    #Insert to Livedata collection
    livedata = db['livedata']
    livedata.insert_many(dfs_dict)

def execute_hpdblog():
    print('Strting HPD Blog scrape')
    # Part 1: Setting up url to scrape
    # #Mac Users
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    #executable_path = {'executable_path': '/chromedriver2'}
    browser = Browser('chrome', **executable_path, headless=False)

    # Windows Users
    #executable_path = {'executable_path': 'chromedriver.exe'}
    #browser = Browser('chrome', **executable_path, headless=False)

    url = "https://cityofhouston.news/category/incident-updates-hpd/"
    browser.visit(url)

    html = browser.html
    soup = BeautifulSoup(html, "html.parser")

    # Part 2: Click the "articles" that we are wanting to scrape
    response_list = soup.find('div', class_ = 'site-content')

    div_article = response_list.find_all('article')

    #Have Article Titles appended to a list
    articleTitles_list = []

    for a in div_article: 
        titles = a.find('h2', class_ = 'entry-title').text
        print(titles)
        print("------------------")
        articleTitles_list.append(titles)

    #Now only get the addresses from the list made above, this is what we'll need for the live map
    at = 'at '
    about = ' about'
    empty_string = ""
    addresses = []

    for index, item in enumerate(articleTitles_list): 
        try: 
            if item == empty_string: 
                print(f"String missing at index {index}")
                addresses.append("")
            else: 
                if item.find(' about')==-1:
                    addresses.append(item[item.index(at)+len(at):])
                elif item.find('at ') != -1 and item.find(' about')!= -1:
                    if item.index(at) < item(about):
                        addresses.append(item[item.index(at)+len(at):item.index(about)])
        except ValueError: 
            addresses.append("")

    #Now get the crime types from the article title 
    into = 'into '
    at = ' at'
    topic_in = "in "
    empty_string = ""
    crime_type = []

    for index, item in enumerate(articleTitles_list): 
        try: 

            if item == empty_string: 
                print(f"String missing at index {index}")
                crime_type.append("")
            else: 
                if item.find(' at')==-1:
                    crime_type.append(item[item.index(into)+len(into):])
                elif item.find('into ') != -1 and item.find(' at')!= -1:
                    if item.index(into) < item.index(at):
                        crime_type.append(item[item.index(into)+len(into):item.index(at)])
                elif item.find('in ')!= -1 and item.find(' at')!= -1: 
                    if item.index(topic_in) < item.index(at):
                        crime_type.append(item[item.index(topic_in)+len(topic_in):item.index(at)])
        except ValueError: 
            crime_type.append("")    

    ## Now get paragraphs and dates in a list
    par_list = []
    date_list = []
    button = response_list.find_all('a', class_='button')

    for content in button:
        try: 
            button_link = content['href']
            browser.visit(button_link)
            button_html = browser.html
            button_soup = BeautifulSoup(button_html, "html.parser")
            article_list = button_soup.find('article')
            date = article_list.find("span", class_ = "posted-date").text
            par = article_list.find("div", class_='entry-content')
            par_text = par.find('p').text
            print(par_text)
            print("----------------")
            print(date)
            par_list.append(par_text)
            date_list.append(date)
            
        except:
            print("----------------")


    #Get time from the paragraphs for the live crime map
    about = 'about '
    am_pm = '.m.'
    empty_string = ""
    time = []

    for index, item in enumerate(par_list): 
        try: 
            if item == empty_string: 
                print(f"String missing at index {index}")
                time.append("")
            else: 
                if item.find('.m.')==-1:
                    time.append(item[item.index(about)+len(about):])
                elif item.find('about ') != -1 and item.find('.m.')!= -1:
                    if item.index(about) < item.index(am_pm):
                        time.append(item[item.index(about)+len(about):item.index(am_pm)])
        except ValueError: 
            print("This doesn't have the text we need")
            time.append("") 

    #Now make a dataframe
    Incident_Updates_df = pd.DataFrame({"date": date_list,
                                        "time of day": time,
                                        "type": crime_type, 
                                        "address": addresses})

    Incident_Updates_df = Incident_Updates_df[Incident_Updates_df["address"]!= ""] 

    Incident_Updates_df["time"] = Incident_Updates_df["date"] + ' '+ Incident_Updates_df["time of day"]

    incident_updates_df = Incident_Updates_df.drop(['date', 'time of day'], axis=1)
    
    #find lat and long for dataframe
    lat = []
    lon = []
    location = []

    for x in range(0,len(incident_updates_df)):
        try:
            print(incident_updates_df['address'][x])
            row = requests.get('https://nominatim.openstreetmap.org/search?q='+ incident_updates_df['address'][x] + ',Houston,Tx&format=json')
            lat.append(row.json()[0]['lat'])
            lon.append(row.json()[0]['lon'])
            location.append([row.json()[0]['lat'],row.json()[0]['lon']])
            print('-----APPEND DONE------')
        except:
            lat.append('')
            lon.append('')
            location.append('')
            pass 

    incident_updates_df['lat'] = lat
    incident_updates_df['lon'] = lon
    incident_updates_df["location"] = location

    incident_updates_df = incident_updates_df[(incident_updates_df['lat']!= '') & (incident_updates_df['lon']!= '')]

    #make dataframe into dictinary

    dict_HPDIncidents = incident_updates_df.to_dict('records')

    with open ('HPDIncidents_new.txt', 'w') as json_file: 
        json.dump(dict_HPDIncidents, json_file)
    df_live = pd.DataFrame({'location':incident_updates_df["location"], 'time':incident_updates_df["time"], 
                        'type':incident_updates_df["type"], 'address':incident_updates_df["address"]})
    
    dfs_dict = df_live.to_dict('records')
    pprint(dfs_dict)
    livedata = db['livedata']
    livedata.insert_many(dfs_dict)


start = time.perf_counter()
execute_hpdtraffic()
execute_hpdblog()
stop = time.perf_counter()
print(f'Total time take is {stop - start}')
