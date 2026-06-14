"""
HR Analytics: Data Scientist Churn Predictor
FastAPI Backend - main.py
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
import numpy as np
import pandas as pd
import joblib
import os
import logging
import __main__

# === QUAN TRỌNG: Import các custom class để joblib có thể "hiểu" được model ===
from custom_transformers.xgboost_transformers import (
    XGB_MissingValueHandler, 
    XGB_OrdinalMapper, 
    XGB_FrequencyEncoder
)
from custom_transformers.lr_transformers import (
    LR_MissingValueHandler, 
    LR_OrdinalMapper,
    LR_FrequencyEncoder
)
from custom_transformers.lightgbm_transformers import (
    LightGBM_MissingValueHandler,
    LightGBM_CategoricalTypeCaster
)
from custom_transformers.randomforest_transformers import (
    RF_MissingValueHandler,
    RF_OrdinalMapper,
    RF_FrequencyEncoder
)
# (Nếu bạn có thêm model Random Forest, LightGBM sau này, cứ import tiếp ở đây)
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HR Churn Predictor API",
    description="Dự đoán khả năng chuyển việc của Data Scientist",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model paths & Thresholds ─────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATHS = {
    "logistic_regression": os.path.join(BASE_DIR, "models", "logistic_regression_baseline.pkl"),
    "random_forest":       os.path.join(BASE_DIR, "models", "best_randomforest_model.pkl"),
    "xgboost":             os.path.join(BASE_DIR, "models", "best_xgboost_model.pkl"), 
    "lightgbm":            os.path.join(BASE_DIR, "models", "lightgbm_best_model.pkl"),
}

MODEL_THRESHOLDS = {
    "logistic_regression": 0.50,  
    "random_forest":       0.5551,  
    "xgboost":             0.57,  
    "lightgbm":            0.36   
}

_cache: dict = {}

def get_model(name: str):
    if name not in _cache:
        path = MODEL_PATHS.get(name)
        if not path or not os.path.exists(path):
            raise FileNotFoundError(
                f"Model '{name}' không tìm thấy tại '{path}'. "
            )
        
        # THAY ĐỔI: Sử dụng joblib.load trực tiếp
        _cache[name] = joblib.load(path)
            
        logger.info(f"Loaded model: {name}")
    return _cache[name]

# ── Schemas ──────────────────────────────────────────────────────────────────
ModelName = Literal["logistic_regression", "random_forest", "xgboost", "lightgbm"]

class Features(BaseModel):
    gender:                 Optional[str]   = None
    education_level:        Optional[str]   = None
    major_discipline:       Optional[str]   = None
    enrolled_university:    Optional[str]   = None
    relevent_experience:    Optional[str]   = None
    experience:             Optional[str]   = None
    last_new_job:           Optional[str]   = None
    company_size:           Optional[str]   = None
    company_type:           Optional[str]   = None
    city:                   Optional[str]   = None
    city_development_index: Optional[float] = None
    training_hours:         Optional[int]   = None

class PredictRequest(BaseModel):
    model_name: ModelName = "xgboost"
    features:   Features

class PredictResponse(BaseModel):
    model_name:        str
    prediction:        int
    label:             str
    probability_stay:  float
    probability_leave: float
    confidence:        str
    risk_level:        str

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "message": "HR Churn Predictor API đang chạy"}

@app.get("/models")
def list_models():
    return {name: os.path.exists(path) for name, path in MODEL_PATHS.items()}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        model = get_model(req.model_name)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    raw = req.features.dict()
    df  = pd.DataFrame([raw])
    df  = df.where(pd.notna(df), other=np.nan)
    TRAIN_COLUMNS = [
        'city', 'city_development_index', 'gender', 'relevent_experience',
        'enrolled_university', 'education_level', 'major_discipline', 
        'experience', 'company_size', 'company_type', 'last_new_job', 'training_hours'
    ]
    df = df[TRAIN_COLUMNS]
    numeric_cols = ['city_development_index', 'training_hours']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')



    try:
        # Lấy mảng xác suất từ mô hình
        proba = model.predict_proba(df)[0]
        p_stay  = round(float(proba[0]), 4)
        p_leave = round(float(proba[1]), 4)
        
        # Gọi threshold tương ứng với mô hình
        threshold = MODEL_THRESHOLDS.get(req.model_name, 0.50)
        
        # Ra quyết định dự đoán
        pred = 1 if p_leave >= threshold else 0
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi dự đoán: {str(e)}")

    top_p = max(p_stay, p_leave)

    # Confidence (Độ tự tin)
    confidence = "Cao" if top_p >= 0.80 else ("Trung bình" if top_p >= 0.65 else "Thấp")
    
    # Cảnh báo Rủi ro
    if p_leave >= threshold + 0.20:
        risk_level = "Rất cao"      
    elif p_leave >= threshold:
        risk_level = "Cao"          
    elif p_leave >= threshold - 0.10:
        risk_level = "Trung bình"   
    else:
        risk_level = "Thấp"   
    import datetime
    current_time = datetime.datetime.now().strftime('%H:%M:%S')
    for m_name in MODEL_PATHS.keys():
        try:
            debug_model = get_model(m_name)
            d_proba = debug_model.predict_proba(df)[0]
            d_p_leave = round(float(d_proba[1]), 4)
            d_threshold = MODEL_THRESHOLDS.get(m_name, 0.50)
            d_pred = 1 if d_p_leave >= d_threshold else 0
            d_label = "Chuyển việc (1)" if d_pred == 1 else "Ở lại (0)"
            
            # Highlight model đang được chọn trên frontend bằng dấu (*)
            is_selected = "(*)" if m_name == req.model_name else "   "
            print(f"{is_selected} [{m_name.upper():<20}] | P(Leave): {d_p_leave:.4f} | Ngưỡng: {d_threshold:<6} => {d_label}")
        except Exception as e:
            print(f"    [{m_name.upper():<20}] | Lỗi không thể dự đoán: {str(e)}")
            
    print(f"{'='*70}\n")      

    return PredictResponse(
        model_name=req.model_name,
        prediction=pred,
        label="Có khả năng chuyển việc" if pred == 1 else "Có khả năng ở lại",
        probability_stay=p_stay,
        probability_leave=p_leave,
        confidence=confidence,
        risk_level=risk_level,
    )