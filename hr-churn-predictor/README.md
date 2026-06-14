#  HR Analytics – Data Scientist Churn Predictor

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn%20%7C%20XGBoost%20%7C%20LightGBM-orange.svg)

Ứng dụng Fullstack hỗ trợ bộ phận Nhân sự (HR) dự đoán khả năng nghỉ việc/chuyển việc (Churn) của ứng viên hoặc nhân viên Data Scientist. Hệ thống đánh giá dựa trên các đặc trưng về nhân khẩu học, học vấn, kinh nghiệm làm việc và thông tin công ty.

---

##  Tính năng nổi bật

- Đa mô hình AI (Multi-model Inference): Tích hợp 4 mô hình Machine Learning tiên tiến (Logistic Regression, Random Forest, XGBoost, LightGBM). Người dùng có thể linh hoạt chuyển đổi mô hình trên giao diện để so sánh kết quả.
- Tối ưu hóa ngưỡng quyết định (Custom Thresholds): Hệ thống không dùng mức 0.5 mặc định. Mỗi mô hình được cấu hình một ngưỡng cắt (threshold) riêng biệt (VD: XGBoost là 0.57, LightGBM là 0.36) để tối ưu hóa độ chính xác cho bài toán phân loại mất cân bằng dữ liệu.
- Xử lý dữ liệu thông minh (Data Pipeline): Backend tích hợp các `custom_transformers` để tự động xử lý dữ liệu khuyết thiếu (Missing Values Imputation), mã hóa biến phân loại (Ordinal/Frequency Encoding) ngay trong lúc dự đoán.
- Giao diện hiện đại (ReactJS): Hỗ trợ Dark/Light mode, kiểm tra trạng thái kết nối API theo thời gian thực, và hiển thị biểu đồ rủi ro trực quan.

---

## 🛠 Công nghệ sử dụng

- **Backend:** Python, FastAPI, Uvicorn.
- **Machine Learning:** Pandas, Numpy, Scikit-learn, XGBoost, LightGBM, Joblib.
- **Frontend:** React 18, Axios, Recharts, CSS Variables.

---

##  Cấu trúc thư mục

```text
HR-CHURN-PREDICTOR/
├── backend/
│   ├── main.py                  # Khởi tạo FastAPI server & API endpoints
│   ├── requirements.txt         # Danh sách thư viện Python
│   ├── custom_transformers/     # QUAN TRỌNG: Chứa logic xử lý data cho Pipelines
│   │   ├── __init__.py
│   │   ├── lr_transformers.py
│   │   ├── randomforest_transformers.py
│   │   ├── xgboost_transformers.py
│   │   └── lightgbm_transformers.py
│   └── models/                  # Nơi đặt các file mô hình (.pkl)
│       ├── logistic_regression_baseline.pkl
│       ├── best_randomforest_model.pkl
│       ├── best_xgboost_model.pkl
│       └── lightgbm_best_model.pkl
│
└── frontend/
    ├── package.json             # Cấu hình dự án React
    ├── public/
    └── src/
        ├── App.js               # Layout và Logic chính của Frontend
        ├── constants.js         # Lưu trữ cấu hình form options
        └── components/          # Các UI components (Form, Card, Chart...)

Hướng dẫn Cài đặt & Khởi chạy

Bước 1: Khởi chạy Backend (API & ML Models)
Mở terminal và thực hiện các lệnh sau:
# 1. Di chuyển vào thư mục backend
cd hr-churn-predictor\backend

# 2. Tạo môi trường ảo (Khuyên dùng)
python -m venv venv

# 3. Kích hoạt môi trường ảo
# Trên Windows:
.\venv\Scripts\activate

# 4. Cài đặt thư viện
pip install -r requirements.txt

# 5. Khởi chạy server FastAPI
uvicorn main:app --reload --port 8000

Bước 2: Khởi chạy Frontend (Giao diện Web)
Mở một terminal mới (để terminal backend tiếp tục chạy) và thực hiện:
# 1. Di chuyển vào thư mục frontend
cd hr-churn-predictor\frontend

# 2. Cài đặt thư viện Node.js (Chỉ làm lần đầu)
npm install

# 3. Khởi chạy ứng dụng React
npm start

Ứng dụng sẽ tự động mở trên trình duyệt tại: http://localhost:3000
