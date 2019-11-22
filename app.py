#from flask import Flask,redirect, render_template
import json
from flask import (
    Flask,
    url_for,
    render_template,
    jsonify,
    request,
    redirect)
import pymongo
from bson.json_util import dumps

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


@app.route("/api/incidents")
def incidentdata():
    livedata = db['livedata']
    data = list(db.livedata.find())
    print("Running incidents")
    return dumps(data)

@app.errorhandler(500)
def internal_error(error):
    return "500 error"

@app.errorhandler(404)
def not_found(error):
    return "404 error",404
    
if __name__ == '__main__':
    app.run(port=5010)