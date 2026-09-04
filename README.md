# 🏠 California Housing Price Prediction

An end-to-end Machine Learning web application that predicts the median house value of California districts using housing and demographic information.

This project covers the complete Machine Learning workflow — from data analysis and preprocessing to model training, hyperparameter tuning, model serialization, and deployment-ready web application development using Flask.

---

## 📌 Project Overview

The **California Housing Price Prediction** project uses Machine Learning to estimate the median house value of a California district based on various features such as:

- Median income
- Housing median age
- Total rooms
- Total bedrooms
- Population
- Households
- Latitude
- Longitude
- Ocean proximity

The project combines **Data Science, Machine Learning, Python, and Web Development** into a complete end-to-end application.

Users can enter housing information through the web interface, and the application processes the input through a trained Machine Learning pipeline and returns the predicted house value in real time.

---

## 🎯 Project Objectives

The main objectives of this project are:

- Understand and analyze the California housing dataset.
- Perform Exploratory Data Analysis (EDA).
- Identify relationships between housing features.
- Handle missing values.
- Perform feature engineering.
- Prepare numerical and categorical features.
- Train multiple Machine Learning regression models.
- Compare model performance.
- Perform hyperparameter tuning.
- Create a complete preprocessing and prediction pipeline.
- Save the trained model using Joblib.
- Build a web application using Flask.
- Connect the Machine Learning model with a web interface.
- Provide real-time housing price predictions.

---

# 🔄 Project Workflow

The complete project follows this workflow:

```text
                    California Housing Dataset
                              │
                              ▼
                    Data Loading & Analysis
                              │
                              ▼
                    Exploratory Data Analysis
                              │
                              ▼
                    Data Preprocessing
                              │
                              ▼
                     Feature Engineering
                              │
                              ▼
                    Train/Test Data Split
                              │
                              ▼
                  Machine Learning Models
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
      Linear Regression   Decision Tree   Random Forest
                              │
                              ▼
                     Model Evaluation
                              │
                              ▼
                    Hyperparameter Tuning
                              │
                              ▼
                  Final ML Pipeline
                              │
                              ▼
                       Joblib Model
                              │
                              ▼
                       Flask Backend
                              │
                              ▼
                    Web Application UI
                              │
                              ▼
                  Real-Time Prediction
```

---

# 📊 Dataset

The project uses the **California Housing Dataset**, which contains information about housing districts in California.

## Features

| Feature | Description |
|---|---|
| `longitude` | Longitude coordinate of the district |
| `latitude` | Latitude coordinate of the district |
| `housing_median_age` | Median age of houses in the district |
| `total_rooms` | Total number of rooms in the district |
| `total_bedrooms` | Total number of bedrooms in the district |
| `population` | Population of the district |
| `households` | Number of households in the district |
| `median_income` | Median income of households |
| `ocean_proximity` | Proximity of the district to the ocean |
| `median_house_value` | Median house value and target variable |

The target variable of the project is:

```text
median_house_value
```

---

# 🔍 Exploratory Data Analysis

Exploratory Data Analysis was performed to understand the structure and characteristics of the dataset.

The analysis includes:

- Dataset overview
- Data types
- Missing value analysis
- Statistical summaries
- Feature distributions
- Target variable distribution
- Correlation analysis
- Geographic visualization
- Relationship between housing features and house prices
- Identification of important patterns and trends

## Visualization Libraries

The following libraries were used:

- Matplotlib
- Seaborn

Examples of visualizations include:

- Histograms
- Scatter plots
- Correlation heatmaps
- Geographic scatter plots
- Feature distribution plots

---

# 🧹 Data Preprocessing

Data preprocessing is an important part of the Machine Learning pipeline.

The project handles both numerical and categorical features.

## Numerical Data

Numerical features are processed using:

- Missing value imputation
- Feature engineering
- Standard scaling

Missing numerical values are handled using **median imputation**.

---

## Categorical Data

The categorical feature:

```text
ocean_proximity
```

is converted into numerical form using:

```text
One-Hot Encoding
```

This allows the Machine Learning model to work with categorical information.

---

# ⚙️ Feature Engineering

Additional meaningful features are created from the existing dataset.

These features help the model understand relationships that may not be obvious from the original columns.

## Rooms per Household

```text
rooms_per_household =
total_rooms / households
```

This represents the average number of rooms available per household.

---

## Population per Household

```text
population_per_household =
population / households
```

This represents the average number of people per household.

---

## Bedrooms per Room

```text
bedrooms_per_room =
total_bedrooms / total_rooms
```

This represents the proportion of bedrooms compared with the total number of rooms.

---

# 🤖 Machine Learning Models

Several regression models were trained and evaluated.

The project includes:

### 1. Linear Regression

A basic regression model used as a baseline for comparison.

### 2. Decision Tree Regressor

A tree-based regression algorithm capable of capturing non-linear relationships between features.

### 3. Random Forest Regressor

An ensemble learning algorithm that combines multiple decision trees to improve prediction performance and generalization.

The Random Forest model was selected as the final model after model evaluation and hyperparameter tuning.

---

# 🔧 Hyperparameter Tuning

The Random Forest model was further optimized using:

```text
GridSearchCV
```

GridSearchCV evaluates different combinations of hyperparameters and identifies a suitable configuration for the model.

This helps improve the performance of the final Random Forest model compared with relying only on default parameters.

---

# 🧠 Complete Machine Learning Pipeline

One of the important parts of this project is that preprocessing and prediction are combined into a single Machine Learning pipeline.

The pipeline performs:

```text
Input Data
    ↓
Median Imputation
    ↓
Feature Engineering
    ↓
Numerical Feature Scaling
    ↓
Categorical One-Hot Encoding
    ↓
Random Forest Regressor
    ↓
Predicted House Value
```

This approach helps ensure that the same preprocessing steps used during model training are also applied during prediction.

---

# 💾 Model Serialization

The final trained Machine Learning pipeline is saved using **Joblib**.

The saved model is located at:

```text
models/housing_model.pkl
```

The `.pkl` file contains the trained prediction pipeline so that the application can load the model directly without retraining it every time the application starts.

---

# 🌐 Web Application

The trained Machine Learning model is integrated into a Flask web application.

The application provides an interactive interface where users can enter housing information and receive a predicted house value.

## Application Flow

```text
User
 │
 ▼
Web Interface
 │
 │ JSON / AJAX Request
 ▼
Flask Backend
 │
 ▼
Prediction Endpoint
 │
 ▼
Saved Joblib Pipeline
 │
 ▼
Preprocessing
 │
 ▼
Random Forest Model
 │
 ▼
Predicted House Value
 │
 ▼
Web Interface
```

---

# 🔌 Flask API

The Flask application exposes a prediction endpoint:

```text
POST /predict
```

The frontend sends the user's housing information to the Flask backend using an AJAX request.

The backend:

1. Receives the input.
2. Processes the input.
3. Loads the saved Machine Learning pipeline.
4. Performs preprocessing.
5. Generates the prediction.
6. Returns the predicted house value.
7. Displays the result on the web interface.

---

# 🖥️ Frontend

The web interface is developed using:

- HTML5
- CSS3
- JavaScript

The frontend communicates with the Flask backend without requiring a full page reload.

AJAX/JSON communication is used to send prediction requests and display the returned result.

The final web interface was refined using **Antigravity**.

---

# ✨ Application Features

- 🏠 California house price prediction
- 🤖 Machine Learning based prediction
- 🌐 Interactive web interface
- ⚡ Real-time prediction
- 🔄 AJAX-based communication
- 🧠 Random Forest regression
- 🔧 Hyperparameter tuning
- 🧹 Automated data preprocessing
- ⚙️ Feature engineering
- 📦 Serialized Machine Learning pipeline
- 📱 Responsive frontend
- 🔌 Flask prediction API

---

# 🛠️ Technologies Used

## Programming Language

- Python 3.10+

## Data Manipulation

- Pandas
- NumPy

## Data Visualization

- Matplotlib
- Seaborn

## Machine Learning

- Scikit-learn
- Linear Regression
- Decision Tree Regressor
- Random Forest Regressor
- GridSearchCV

## Statistical Computing

- SciPy

## Model Serialization

- Joblib

## Backend

- Flask

## Frontend

- HTML5
- CSS3
- JavaScript
- AJAX
- JSON

## Development & Version Control

- Jupyter Notebook
- Git
- GitHub
- Antigravity

---

# 📁 Project Structure

```text
California-Housing-ML/
│
├── app/
│   ├── app.py
│   │
│   ├── templates/
│   │   └── index.html
│   │
│   └── static/
│       ├── style.css
│       └── script.js
│
├── data/
│   └── housing.csv
│
├── models/
│   └── housing_model.pkl
│
├── notebooks/
│   └── California_Housing_Price_Prediction.ipynb
│
├── src/
│   └── preprocessing.py
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

Follow the steps below to run the project locally.

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd california-housing-price-prediction
```

---

## 2. Create a Virtual Environment

On Windows:

```bash
python -m venv venv
```

Activate the environment:

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

Install the required Python libraries:

```bash
pip install -r requirements.txt
```

---

# ▶️ Run the Application

Start the Flask application using:

```bash
python app/app.py
```

After starting the application, open your browser and visit:

```text
http://127.0.0.1:5000
```

The California Housing Price Prediction web application should now be available locally.

---

# 🧪 Example Prediction Workflow

A user enters values such as:

```text
Longitude
Latitude
Housing Median Age
Total Rooms
Total Bedrooms
Population
Households
Median Income
Ocean Proximity
```

The application sends these values to the Flask `/predict` endpoint.

The Machine Learning pipeline then performs:

```text
User Input
    ↓
Validation
    ↓
Feature Engineering
    ↓
Missing Value Handling
    ↓
Scaling
    ↓
One-Hot Encoding
    ↓
Random Forest Prediction
    ↓
Predicted House Value
```

The final prediction is returned to the user through the web interface.

---

# 📈 Model Evaluation

The Machine Learning models were evaluated during the development process to compare their prediction performance.

The project also uses statistical analysis for evaluation, including calculation of confidence intervals for the RMSE metric.

The final model is based on a tuned:

```text
Random Forest Regressor
```

Model evaluation and experimentation can be found in:

```text
notebooks/California_Housing_Price_Prediction.ipynb
```

---

# 🔐 Important Deployment Considerations

When deploying the application, the following should be considered:

- Python version compatibility
- Scikit-learn version compatibility
- Joblib model compatibility
- Model file size
- Required Python dependencies
- Production Flask server configuration
- Environment variables where required

The application can be deployed to a cloud platform that supports Python and Flask applications.

---

# 🚀 Future Improvements

The project can be further improved by adding:

- [ ] Public cloud deployment
- [ ] Interactive data visualizations
- [ ] Model performance dashboard
- [ ] Prediction confidence/range
- [ ] Improved input validation
- [ ] Additional regression models
- [ ] Automated model retraining
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Model monitoring
- [ ] API documentation
- [ ] Database integration
- [ ] Improved UI/UX

---

# 📚 Key Concepts Demonstrated

This project demonstrates practical knowledge of:

### Data Science

- Data loading
- Data cleaning
- Exploratory Data Analysis
- Statistical analysis
- Data visualization

### Machine Learning

- Regression
- Train/test splitting
- Feature engineering
- Missing value imputation
- Feature scaling
- One-hot encoding
- Machine Learning pipelines
- Random Forest
- Decision Trees
- Linear Regression
- Hyperparameter tuning
- GridSearchCV
- Model evaluation

### Deployment & Development

- Model serialization
- Joblib
- Flask
- REST API
- AJAX
- JSON
- Frontend/backend integration
- Git
- GitHub
- Deployment preparation

---

# 💡 What I Learned From This Project

Through this project, I learned how to take a Machine Learning project beyond a Jupyter Notebook and turn it into a complete application.

The project helped me understand the complete process:

```text
Data
 ↓
Analysis
 ↓
Preprocessing
 ↓
Feature Engineering
 ↓
Machine Learning
 ↓
Model Evaluation
 ↓
Model Serialization
 ↓
Backend API
 ↓
Web Interface
 ↓
Real-Time Prediction
```

This project demonstrates how a trained Machine Learning model can be integrated into a practical software application that can be used by end users.

---

# 👨‍💻 Author

## Anurag Pravin Deshmukh

**B.Tech – Artificial Intelligence**

Interested in:

- Data Analysis
- Data Science
- Machine Learning
- Artificial Intelligence
- Python
- Web Development

---

# ⭐ Project

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📌 Project Summary

**California Housing Price Prediction** is an end-to-end Machine Learning project that combines:

```text
Python
+
Pandas
+
NumPy
+
Matplotlib
+
Seaborn
+
Scikit-learn
+
Joblib
+
Flask
+
HTML/CSS/JavaScript
+
Machine Learning
```

to build a complete **California house price prediction web application**.

The project demonstrates the complete journey from **raw housing data to a working Machine Learning-powered web application**.
