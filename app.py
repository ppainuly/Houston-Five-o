#from flask import Flask,redirect, render_template
import json
from severityPrediction import Locator
from flask import (
    Flask,
    url_for,
    render_template,
    jsonify,
    request,
    redirect)
import pymongo
from bson.json_util import dumps
import areaCalculator as ac

uri = "mongodb://livecrime_user:track#txN0W@ds137498.mlab.com:37498/heroku_jq1zsq2q?retryWrites=false"
client = pymongo.MongoClient(uri)
db = client.heroku_jq1zsq2q

app = Flask(__name__)

@app.route("/")
def build():
    return render_template("index.html")

@app.route("/crime")
def crime():
    return render_template("crime.html")

@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/search")
def search():
    return render_template("search.html")

@app.route("/model")
def model():
    return render_template("model.html")

@app.route("/plot/<lat>/<lng>")
def plot(lat, lng):
    plot_list = Locator(lat, lng)

    plot_data = [{
        "x" : plot_list[0],
        "y" : plot_list[1],
        "fill" : "tozeroy",
        "type" : "scatter",
        "mode" : "lines+markers+text",
        "textposition" : "top left",
        "text" : plot_list[1]
    }]

    return jsonify(plot_data)


@app.route("/api/incidents")
def incidentdata():
    livedata = db['livedata']
    data = list(db.livedata.find())
    print("Running incidents")
    return dumps(data)

@app.route("/neighbourhood/<lat>/<lng>")
def neighbourhood(lat,lng):
    print(f'lat: `{lat}')
    print(type(lat))
    print(f'lat: `{lng}')
    print(type(lng))
    print('Running ac snbname function')
    area = ac.snbname(lat, lng)
    print('snbname function executed')
    print(area)
    df_area = ac.buildCount(area['snbname'])
    print('returned dataframe from areaCalculator')

    print(len(df_area))
    print('Building trace')
    h = ['12AM','1AM', '2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM', '4PM','5PM','6PM','7PM','8PM', '9PM', '10PM','11PM']
    count = df_area['Predictions'].to_list()
    count_round = [round(x) for x in count]
    # trace1 = [
    #     {
    #       "x": h,
    #       "y": count,
    #       "type": "bar"
    #     }
    #   ]
    trace1 = [{
        "x": h,
        "y": count_round,
        "type": 'bar',
        "text": count_round,
        "textposition": "auto",
        "hoverinfo": "none",
        "marker": {
            "color": "rgb(107, 179, 80)",
            "opacity": 0.6,
            "line": {
            "color": "rgb(8,48,107)",
            "width": 2.5
            }
        }
    }]

    #print(trace1)
    try:
        return jsonify(trace1)
    except Exception as e:

        print(e)
        pass





@app.errorhandler(500)
def internal_error(error):
    return "500 error"

@app.errorhandler(404)
def not_found(error):
    return "404 error",404
    
if __name__ == '__main__':
    app.run(port=5010)