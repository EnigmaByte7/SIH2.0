from flask import Flask, jsonify
import pandas as pd
import joblib
import os
import numpy as np

# Initialize the Flask application
app = Flask(__name__)

# --- Load Model and Define Functions ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'fault_detector_model.joblib')

try:
    model = joblib.load(model_path)
    print("✅ Model loaded successfully from local path.")
except FileNotFoundError:
    print(f"❌ ERROR: Model file not found at {model_path}.")
    model = None

def extract_features(df, window_size=10):
    sensors = sorted(list(set([col.split('_')[0] for col in df.columns if 'Sensor' in col])))
    features_df = pd.DataFrame(index=df.index)
    for sensor in sensors:
        v_col, i_col = f'{sensor}_V', f'{sensor}_I'
        if v_col in df.columns:
            v_rolling = df[v_col].rolling(window=window_size)
            features_df[f'{v_col}_mean'] = v_rolling.mean()
            features_df[f'{v_col}_std'] = v_rolling.std()
        if i_col in df.columns:
            i_rolling = df[i_col].rolling(window=window_size)
            features_df[f'{i_col}_mean'] = i_rolling.mean()
            features_df[f'{i_col}_std'] = i_rolling.std()
    features_df.dropna(inplace=True)
    return features_df

LABEL_TO_FAULT_NAME = {
    0: "Normal",
    1: "Open_Circuit",
    2: "LG_Fault_High_Imp",
    # Add other mappings from your training data here if needed
}

# --- API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"status": "ERROR", "message": "Model not loaded."}), 500
    try:
        data_filepath = os.path.join(BASE_DIR, 'test_data.csv')
        new_data = pd.read_csv(data_filepath)
        
        features = extract_features(new_data.drop('Label', axis=1, errors='ignore'))
        
        if features.empty:
            return jsonify({"status": "ERROR", "message": "Not enough data for prediction."}), 400

        predictions = model.predict(features)
        
        for i, p in enumerate(predictions):
            if p != 0:
                result = {
                    "status": "FAULT",
                    "time": new_data.loc[features.index[i], 'Time'],
                    "type": LABEL_TO_FAULT_NAME.get(p, f"Unknown Fault ({p})"),
                }
                return jsonify(result)
        
        return jsonify({"status": "NORMAL"})
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500

# --- Run Server ---
if __name__ == '__main__':
    app.run(port=5001, debug=True)