"""
app.py - Web Application for California Housing Price Prediction.

Provides a clean, professional web interface for users to enter California
housing district features and receive instant predicted house values.
Includes model methodology explanation, real performance comparisons,
and feature importance breakdown.
"""

import json
import os
import sys
from flask import Flask, render_template, request, jsonify

# Path configuration
APP_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(APP_DIR)
SRC_DIR = os.path.join(PROJECT_DIR, "src")

for path in [SRC_DIR, PROJECT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from predict import predict_single, VALID_OCEAN_PROXIMITIES, MODEL_PATH

app = Flask(__name__, template_folder="templates", static_folder="static")

RESULTS_PATH = os.path.join(PROJECT_DIR, "models", "model_results.json")


def load_model_results():
    """
    Loads pre-calculated actual evaluation metrics and feature importances.
    """
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None
    return None


@app.route("/", methods=["GET"])
def index():
    """
    Renders main prediction interface with dynamic model metrics and explanations.
    """
    results_data = load_model_results()
    model_ready = os.path.exists(MODEL_PATH)

    # Sensible default sample for California (e.g. Berkeley / Bay Area district)
    default_inputs = {
        "longitude": -122.23,
        "latitude": 37.88,
        "housing_median_age": 41.0,
        "total_rooms": 880.0,
        "total_bedrooms": 129.0,
        "population": 322.0,
        "households": 126.0,
        "median_income": 8.3252,
        "ocean_proximity": "NEAR BAY",
    }

    return render_template(
        "index.html",
        ocean_options=VALID_OCEAN_PROXIMITIES,
        default_inputs=default_inputs,
        model_results=results_data,
        model_ready=model_ready,
    )


@app.route("/predict", methods=["POST"])
def predict():
    """
    Handles house price prediction requests from the web interface.
    Supports both JSON payloads and traditional form submissions.
    """
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        if not data:
            return jsonify({"success": False, "error": "No input data provided."}), 400

        result = predict_single(data)
        return jsonify({
            "success": True,
            "predicted_value": result["predicted_value"],
            "formatted_value": result["formatted_value"],
            "input_features": result["input_features"],
        })

    except FileNotFoundError as fnf:
        return jsonify({
            "success": False,
            "error": "Model file not found. Please train the model using 'python src/train_model.py' first."
        }), 503
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as ex:
        return jsonify({
            "success": False,
            "error": f"An unexpected prediction error occurred: {str(ex)}"
        }), 500


@app.route("/health", methods=["GET"])
def health():
    """
    Health check endpoint.
    """
    return jsonify({
        "status": "healthy",
        "model_loaded": os.path.exists(MODEL_PATH),
    })


if __name__ == "__main__":
    # Host on 127.0.0.1:5000 for local development
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting California Housing Price Prediction App on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
