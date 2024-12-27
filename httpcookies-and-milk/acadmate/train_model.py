import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, classification_report, confusion_matrix, accuracy_score
import joblib

# File path configuration
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = 'sd1.csv'

try:
    # Load and preprocess the data
    df = pd.read_csv(csv_path)
    
    # Prepare features and target
    X = df['marks'].values.reshape(-1, 1)
    y = df['grades']
    
    # Handle missing values
    if y.isnull().any():
        print("Removing rows with missing grade values...")
        mask = y.notnull()
        X = X[mask]
        y = y[mask]
    
    # Grade mapping
    grade_mapping = {
        'A+': 0, 
        'A': 1, 
        'B+': 2, 
        'B': 3, 
        'C+': 4, 
        'C': 5,
        'D': 6,
        'F': 7
    }
    
    # Convert grades to numeric values
    y = y.map(grade_mapping)
    
    # Check if any grades couldn't be mapped
    if y.isnull().any():
        raise ValueError("Some grades in the dataset don't match the defined grade_mapping")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None
    )
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Initialize and train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    
    # Train the model
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_scaled)
    
    # Evaluate the model
    mae = mean_absolute_error(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Print evaluation metrics
    print("\nModel Evaluation:")
    print(f"Mean Absolute Error: {mae:.4f}")
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Print confusion matrix
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    print("\nFeature Importance:")
    print(f"Marks importance: {model.feature_importances_[0]:.4f}")
    
    # Save the model and scaler
    model_filename = 'random_forest_model_sdf1.joblib'
    scaler_filename = 'scaler_sdf1.joblib'
    
    joblib.dump(model, model_filename)
    joblib.dump(scaler, scaler_filename)
    
    print(f"\nModel saved as: {model_filename}")
    print(f"Scaler saved as: {scaler_filename}")
    
    # Create a prediction function
    def predict_grade(marks, model=model, scaler=scaler, grade_mapping=grade_mapping):
        # Inverse grade mapping for converting numeric predictions back to letter grades
        inverse_grade_mapping = {v: k for k, v in grade_mapping.items()}
        
        # Scale the input
        marks_scaled = scaler.transform([[marks]])
        
        # Get numeric prediction
        numeric_prediction = model.predict(marks_scaled)[0]
        
        # Convert back to letter grade
        letter_grade = inverse_grade_mapping[numeric_prediction]
        
        # Get probability distribution
        probabilities = model.predict_proba(marks_scaled)[0]
        confidence = max(probabilities) * 100
        
        return letter_grade, confidence
    
    # Test the prediction function
    print("\nSample Predictions:")
    test_marks = [95, 85, 75, 65]
    for marks in test_marks:
        grade, confidence = predict_grade(marks)
        print(f"Marks: {marks} -> Predicted Grade: {grade} (Confidence: {confidence:.2f}%)")

except FileNotFoundError:
    print(f"Error: Could not find the file: {csv_path}")
except pd.errors.EmptyDataError:
    print("Error: The CSV file is empty.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
