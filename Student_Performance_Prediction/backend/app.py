from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = "admin-secret-key"  # change in real apps
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


model = joblib.load("model.pkl")

CSV_FILE = "student_data.csv"

# Create CSV if not exists
if not os.path.exists(CSV_FILE):
    df = pd.DataFrame(columns=[
        "RollNumber", "Gender", "StudyTimeWeekly", "AttendanceRatio",
        "Tutoring", "ParentalSupport", "Prediction"
    ])
    df.to_csv(CSV_FILE, index=False)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        total_classes = int(data["TotalClasses"])
        classes_attended = int(data["ClassesAttended"])
        attendance_ratio = classes_attended / total_classes

        input_df = pd.DataFrame([{
            "Gender": data["Gender"],
            "StudyTimeWeekly": float(data["StudyTimeWeekly"]),
            "AttendanceRatio": attendance_ratio,
            "Tutoring": data["Tutoring"],
            "ParentalSupport": data["ParentalSupport"]
        }])

        # 🔹 ML Prediction
        prediction = int(model.predict(input_df)[0])

        # ✅ ADD THIS PART EXACTLY HERE (SAVE DATA)
        save_df = pd.DataFrame([{
            "RollNumber": data["RollNumber"],
            "Gender": data["Gender"],
            "StudyTimeWeekly": float(data["StudyTimeWeekly"]),
            "AttendanceRatio": attendance_ratio,
            "Tutoring": data["Tutoring"],
            "ParentalSupport": data["ParentalSupport"],
            "Prediction": prediction
        }])

        save_df.to_csv(CSV_FILE, mode="a", header=False, index=False)

        return jsonify({
            "prediction": prediction,
            "attendance_ratio": round(attendance_ratio, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/login", methods=["POST", "OPTIONS"])
def admin_login():
    if request.method == "OPTIONS":
        return jsonify({"ok": True})

    data = request.json
    if data["username"] == "admin" and data["password"] == "admin123":
        session["admin"] = True
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


# 🔐 ADMIN: get all data
@app.route("/admin/data", methods=["GET"])
def admin_data():
    if not session.get("admin"):
        return jsonify({"error": "Unauthorized"}), 403

    df = pd.read_csv(CSV_FILE)
    return jsonify({
        "count": len(df),
        "data": df.to_dict(orient="records")
    })


# ⬇️ ADMIN: download CSV
@app.route("/admin/download", methods=["GET"])
def download_csv():
    return send_file(CSV_FILE, as_attachment=True)

@app.route("/admin/logout", methods=["GET"])
def admin_logout():
    session.pop("admin", None)
    return jsonify({"message": "Logged out"})



if __name__ == "__main__":
    app.run(debug=True)
