import pandas as pd
import numpy as np
from sklearn import svm
from django.conf import settings
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split , RandomizedSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
import os
from sklearn.metrics import  mean_absolute_error
import joblib
import random

'''
def predict(total, subject):    
    model_path = os.path.join(settings.BASE_DIR, 'random_forest_model.joblib')
   # model_path = 'ranom_forest_model.joblib'
    try:
        model = joblib.load(model_path)
    except FileNotFoundError:
        return "Model not found. Please train the model first."
    
    # Make the prediction
    total_reshaped = np.array(total).reshape(1, -1)  
    predicted_grade = model.predict(total_reshaped)
    
    return predicted_grade[0] 
'''

def predict(total, subject):
    # Define paths

    if(subject=='OSSLAB'):
        model_path = os.path.join(settings.BASE_DIR, 'random_forest_model.joblib')
        scaler_path = os.path.join(settings.BASE_DIR, 'scaler.joblib')
    else:
        predicted_grade = "F"

        if total > 83:
            predicted_grade = "A+"
        elif total >= 75:
            predicted_grade = "A"
        elif total >= 65:
            predicted_grade = "B+"
        elif total >= 55:
            predicted_grade = "B"
        elif total >= 47:
            predicted_grade = "C+"
        elif total >= 36:
            predicted_grade = "D"
        
        confidence = 100

        return {
            'grade': predicted_grade,
            'confidence': round(confidence, 2)
        }
    
    try:
        # Load both model and scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        # Prepare the input
        total_reshaped = np.array(float(total)).reshape(1, -1)
        
        # Scale the input
        scaled_input = scaler.transform(total_reshaped)
        
        # Make prediction
        numeric_prediction = model.predict(scaled_input)[0]
        
        # Define grade mapping (same as used in training)
        grade_mapping = {
            0: 'A+',
            1: 'A',
            2: 'B+',
            3: 'B',
            4: 'C+',
            5: 'C',
            6: 'D',
            7: 'F'
        }
        
        # Convert numeric prediction to letter grade
        predicted_grade = grade_mapping[numeric_prediction]
        
        # Get prediction probability/confidence
        probabilities = model.predict_proba(scaled_input)[0]
        confidence = float(max(probabilities) * 100)
        
        return {
            'grade': predicted_grade,
            'confidence': round(confidence, 2)
        }
        
    except FileNotFoundError as e:
        if 'random_forest_model.joblib' in str(e):
            return {"error": "Model file not found. Please train the model first."}
        elif 'scaler.joblib' in str(e):
            return {"error": "Scaler file not found. Please train the model first."}
    except ValueError as e:
        return {"error": f"Invalid input: {str(e)}"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
