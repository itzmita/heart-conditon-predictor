from flask import Flask, render_template, jsonify, json, request, redirect
from joblib import dump, load
from pickle import dump as dump_p, load as load_p
import numpy as np
import pandas as pd


# Load pipeline
pipeline = load("driver_score/ml/pipeline_v1.joblib")
# Load the label encoders
le_gender = load_p(open('driver_score/ml/le_gender.pkl', 'rb'))
le_body = load_p(open('driver_score/ml/le_body.pkl', 'rb'))
le_make = load_p(open('driver_score/ml/le_make.pkl', 'rb'))
le_day = load_p(open('driver_score/ml/le_day.pkl', 'rb'))

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    prediction = 0
    a = {}

    if request.method == "POST":
        print(request.form)
        # read form data inputed by user
        user_age = request.form["selectAge"]
        user_gender = request.form["personGender"]
        car_year = request.form["carYear"]
        car_make = request.form["carMake"]
        car_body = request.form["carBody"]
        travel_day = request.form["travelDay"]

        # Place user inputs into a list and create df for label encoding
        inputs = [user_age, user_gender, car_year, car_body, car_make, travel_day]
        inputs_pd = pd.DataFrame([inputs, inputs])
        # Encode user inputs
        inputs_pd[1] = le_gender.transform(inputs_pd[1])
        inputs_pd[3] = le_body.transform(inputs_pd[3])
        inputs_pd[4] = le_make.transform(inputs_pd[4])
        inputs_pd[5] = le_day.transform(inputs_pd[5])

        # Run the pipeline (Scaler and rf_model) on user inputs
        prediction_vector = pipeline.predict_proba(inputs_pd)
        # Extract the probability to get 1(Serious or Fatal crash)
        prediction = prediction_vector[0][1]
        print(prediction)
        
        # Dict of user inputs to reload
        a = {
        "selectAge": user_age,
        "personGender": user_gender,
        "carYear": car_year,
        "carMake": car_make,
        "carBody": car_body,
        "travelDay": travel_day
        }
        print(a)

    return render_template("index.html", predict=5 * prediction, form_reuse=a)
    
if __name__ == "__main__":
    app.run(debug=True)