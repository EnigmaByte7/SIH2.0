# Smart Grid Fault Detection & Isolation System

## 🌟 Overview

A sophisticated full-stack application designed for real-time fault detection, classification, and isolation in electrical distribution systems. This system combines modern web technologies with machine learning to provide instant fault analysis and automated circuit protection.

![GitHub](https://img.shields.io/github/license/EnigmaByte7/SIH2.0)

## 🎯 Key Features

- **Real-Time Monitoring**
  - Live sensor data visualization
  - Dynamic voltage and current charts
  - Multi-line monitoring capability
  - Up to 50 data points per chart with auto-shifting

- **Fault Detection & Analysis**
  - ML-powered fault classification
  - Precise fault section localization
  - Support for multiple sensor points (A, B, C, D)
  - Automated fault type prediction

- **Interactive Dashboard**
  - Status cards with real-time updates
  - Color-coded fault indicators
  - Recharts-based data visualization
  - Responsive grid layout

- **Circuit Protection**
  - One-click circuit isolation
  - Manual reset capability
  - Fault location display
  - Automated trip signals

## 🏗️ Technical Architecture

### Frontend (client/)
- **Core**: React + Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Real-time**: Socket.IO client
- **UI Components**: Custom cards, charts, and grid layouts

### Backend (server/)
- **Server**: Node.js + Express
- **Real-time**: Socket.IO
- **Database**: MongoDB
- **APIs**: RESTful endpoints for circuit control
- **Data Simulation**: Built-in sensor data generator

### ML Engine (python-engine/)
- **Framework**: Flask
- **ML Libraries**: scikit-learn
- **Data Processing**: numpy, pandas
- **Models**: Optimized classifier with pre-trained weights

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 14.x
- Python >= 3.8
- MongoDB
- npm or yarn

### Python ML Engine
```bash
cd python-engine
2.  **Create** and **Activate** the virtual environment:
    python3 -m venv venv
    source venv/bin/activate
pip install -r requirements.txt
# Ensure model files are present:
# - fault_classifier_model_optimized.pkl
# - data_scaler.pkl
# - label_encoder.pkl
python app.py
```

### Node.js Backend
```bash
cd server
npm install
# Configure environment variables
cp .env.example .env
# Update MONGO_URI in .env
npm start
```

### React Frontend
```bash
cd client
npm install
npm run dev
```

## 🔌 System Configuration

### Port Configuration
- Frontend: localhost:5173
- Backend: localhost:5001
- ML Engine: localhost:5000

### Environment Variables
```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

## 💻 Usage Guide

### Dashboard Navigation
1. Access the dashboard at `localhost:5173`
2. Monitor real-time sensor readings
3. Observe fault predictions and locations
4. Control circuit breakers when faults are detected

### Circuit Control
- **Trip Button**: Isolates circuit upon fault detection
- **Reset Button**: Resumes monitoring after fault clearance
- **Status Cards**: Shows current state and fault type
- **Live Charts**: Displays voltage and current trends

## 🔧 Core Components

### AnalysisDashboard
- Real-time data processing
- Socket.IO integration
- Dynamic UI updates
- Multi-line monitoring

### ML Prediction Engine
- Feature scaling
- Fault classification
- Section localization
- Confidence scoring

### Data Simulation
- Realistic sensor data generation
- Configurable fault scenarios
- Multiple line support
- Variable severity levels

## 📊 Data Flow

1. Sensor data generation (server)
2. Real-time transmission (Socket.IO)
3. ML analysis (Python engine)
4. Frontend visualization
5. User control actions
6. Circuit state management

## 🛠️ Development

### Code Structure
```
SIH2.0/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisDashboard.jsx
│   │   │   └── ...
│   │   └── pages/
│   │       └── Dashboard.jsx
├── server/
│   ├── index.js
│   └── routes/
└── python-engine/
    └── app.py
```

### Adding New Features
1. Implement backend endpoint
2. Update ML model if needed
3. Add frontend component
4. Test real-time functionality

## 🧪 Testing

- Frontend: Component testing with React Testing Library
- Backend: API testing with Jest
- ML Engine: Model validation with test datasets

## 📚 API Documentation

### Circuit Control Endpoints

#### Trip Circuit
```http
POST /api/control/trip
{
  "lineId": "string",
  "faultType": "string"
}
```

#### Reset Circuit
```http
POST /api/control/reset
{
  "lineId": "string"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **EnigmaByte7** - *Initial work* - [GitHub](https://github.com/EnigmaByte7)

## 🙏 Acknowledgments

- Smart India Hackathon 2.0 for the opportunity
- Contributors and maintainers
- Open source community
