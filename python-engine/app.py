from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import numpy as np
import pandas as pd
import warnings
import traceback # Needed for detailed error logging

# -------------------------------------------------------------
# 1. APP INITIALIZATION & WARNING SUPPRESSION
# -------------------------------------------------------------

# Initialize the Flask application
# NOTE: The provided code was missing this line.
app = Flask(__name__)

# Crucial for allowing your MERN frontend (running on a different port/domain) to talk to Flask
CORS(app) 

# -------------------------------------------------------------
# 2. CONFIGURATION & ASSET LOADING
# -------------------------------------------------------------

# --- File Paths ---
MODEL_PATH = 'fault_classifier_model_optimized.pkl'
SCALER_PATH = 'data_scaler.pkl'
ENCODER_PATH = 'label_encoder.pkl'

# --- Feature Names (Must match training data order) ---
FEATURE_NAMES = [
    'SensorA_V', 'SensorA_I', 
    'SensorB_V', 'SensorB_I', 
    'SensorC_V', 'SensorC_I', 
    'SensorD_V', 'SensorD_I'
]

# --- Load Assets on Startup ---
try:
    print("Loading Model, Scaler, and Encoder...")
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    le = joblib.load(ENCODER_PATH)
    print("Assets loaded successfully.")
except Exception as e:
    print(f"ERROR: Failed to load one or more assets. Check paths and file names. Error: {e}")
    # Set to None to prevent the app from running predictions
    model, scaler, le = None, None, None

# -------------------------------------------------------------
# 3. PREDICTION ROUTE
# -------------------------------------------------------------

@app.route('/predict_fault', methods=['POST'])
def predict():
    if model is None or scaler is None or le is None:
        return jsonify({"error": "Model assets not loaded on the server."}), 500

    try:
        data = request.get_json(force=True)
        raw_features = data.get('sensor_values') 
        
        EXPECTED_FEATURES = 8
        
        # Validation Check
        if not raw_features or not isinstance(raw_features, list) or len(raw_features) != EXPECTED_FEATURES:
            print(f"ERROR: Invalid features received. Expected {EXPECTED_FEATURES}, got {len(raw_features) if isinstance(raw_features, list) else 'non-list'}.")
            return jsonify({"error": f"Invalid feature array size. Expected {EXPECTED_FEATURES} sensor values."}), 400

        # --- PANDAS FIX: Convert to DataFrame for Scaling ---
        # 1. Convert the raw list into a Pandas DataFrame with the expected column names
        input_df = pd.DataFrame(
            [raw_features],  # Needs to be a list of lists (1 row)
            columns=FEATURE_NAMES  # Use the defined feature names
        )

        # 2. Scale the data. The scaler now sees the correct feature names (Fixes UserWarning).
        scaled_features = scaler.transform(input_df)
        
        # 3. Predict 
        prediction_index = model.predict(scaled_features)[0]
        
        # 4. Decode the result
        fault_type = le.inverse_transform([prediction_index])[0]
        
        return jsonify({
            "status": "success",
            "fault_prediction": fault_type
        })
        
    except Exception as e:
        print("--- UNEXPECTED PYTHON ERROR IN FLASK ---")
        traceback.print_exc()
        return jsonify({"error": f"Internal Python error during prediction: {str(e)}"}), 500

# -------------------------------------------------------------
# 4. SERVER RUN
# -------------------------------------------------------------

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)