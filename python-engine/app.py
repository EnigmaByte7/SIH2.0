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


def determine_fault_section(fault_type, scaled_features):
    """
    Estimates the fault section by checking for the largest voltage drop between 
    consecutive sensors (V_prev - V_current) along the radial feeder (A -> D).
    """
    
    # 1. Handle Normal Status Immediately
    if fault_type == 'Normal':
        return "System OK / Nominal"
    
    # --- Feature Extraction (Ensure indices 0, 2, 4, 6 are Voltages) ---
    V_A = scaled_features[0, 0] 
    V_B = scaled_features[0, 2] 
    V_C = scaled_features[0, 4] 
    V_D = scaled_features[0, 6] 

    # Define a minimum threshold for detection (e.g., 10% of the scaled range)
    # This prevents noise from triggering a section change.
    DROP_THRESHOLD = 0.15 
    
    # ----------------------------------------------------------------------
    # 2. Prioritized Section Check (Starting from the furthest point, D -> A)
    # ----------------------------------------------------------------------

    # Check Drop 3: Section C-D
    # The drop V_C - V_D must exceed the threshold
    if (V_C - V_D) > DROP_THRESHOLD:
        return "Section CD (Between C and D)"

    # Check Drop 2: Section B-C
    if (V_B - V_C) > DROP_THRESHOLD:
        return "Section BC (Between B and C)"

    # Check Drop 1: Section A-B
    if (V_A - V_B) > DROP_THRESHOLD:
        return "Section AB (Between A and B)"

    # 3. Check Section S-A (Closest to Source)
    # If no inter-sensor drop is significant, but the voltage at A is low (indicating a fault near the source).
    if V_A < 0.85: 
        return "Section SA (Near Source / Sensor A)"
        
    # 4. Final Fallback (If fault predicted but location logic is inconclusive)
    return "Location Ambiguous (Fault Confirmed)"

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
        input_df = pd.DataFrame(
            [raw_features],
            columns=FEATURE_NAMES
        )

        scaled_features = scaler.transform(input_df)
        
        # 1. Predict Fault Type (Classification)
        prediction_index = model.predict(scaled_features)[0]
        
        # 2. Decode the result
        fault_type = le.inverse_transform([prediction_index])[0]
        
        # 3. Determine Fault Location (NEW STEP)
        fault_location_section = determine_fault_section(fault_type, scaled_features)
       
        # --- DIAGNOSTIC PRINT (CRITICAL) ---
        response_payload = {
            "status": "success",
            "fault_prediction": fault_type,
            "fault_location_section": fault_location_section 
        }
        # print("--- FLASK RESPONSE PAYLOAD ---")
        # print(response_payload)

        return jsonify(response_payload)
        
    except Exception as e:
        import traceback
        print("--- UNEXPECTED PYTHON ERROR IN FLASK ---")
        traceback.print_exc()
        return jsonify({"error": f"Internal Python error during prediction: {str(e)}"}), 500
# -------------------------------------------------------------
# 4. SERVER RUN
# -------------------------------------------------------------

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)