import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
# --- ĐỊNH NGHĨA CÁC LỚP TIỀN XỬ LÝ  ---
class RF_MissingValueHandler(BaseEstimator, TransformerMixin):
    def __init__(self):
        #Khai báo MODE_COLS và MEDIAN_COLS 
        self.MODE_COLS = ['relevent_experience', 'enrolled_university', 'education_level', 'experience', 'last_new_job']
        self.MEDIAN_COLS = ['city_development_index', 'training_hours']   
        self.mode_values = {}
        self.median_values = {}
    def fit(self, X, y=None):
        # Học giá trị Mode
        for col in self.MODE_COLS:
            self.mode_values[col] = X[col].mode()[0]   
        # Học giá trị Median
        for col in self.MEDIAN_COLS:
            self.median_values[col] = X[col].median()   
        return self
    def transform(self, X):
        X_copy = X.copy()
        X_copy[['company_size', 'company_type', 'gender']] = X_copy[['company_size', 'company_type', 'gender']].fillna('Unknown')
        X_copy['major_discipline'] = X_copy['major_discipline'].fillna('No Info')
        for col in self.MODE_COLS:
            X_copy[col] = X_copy[col].fillna(self.mode_values[col])  
        for col in self.MEDIAN_COLS:
            X_copy[col] = X_copy[col].fillna(self.median_values[col])
            
        return X_copy
class RF_OrdinalMapper(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        edu_map = {'Primary School': 0, 'High School': 1, 'Graduate': 2, 'Masters': 3, 'Phd': 4}
        X_copy['education_level'] = X_copy['education_level'].map(edu_map)
        exp_map = {'<1': 0, '>20': 21}
        for i in range(1, 21): exp_map[str(i)] = i
        X_copy['experience'] = X_copy['experience'].map(exp_map)
        size_map = {'Unknown': -1, '<10': 0, '10/49': 1, '50-99': 2, '100-500': 3, '500-999': 4, '1000-4999': 5, '5000-9999': 6, '10000+': 7}
        X_copy['company_size'] = X_copy['company_size'].map(size_map)
        job_map = {'never': 0, '1': 1, '2': 2, '3': 3, '4': 4, '>4': 5}
        X_copy['last_new_job'] = X_copy['last_new_job'].map(job_map)
        return X_copy
class RF_FrequencyEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, column='city'):
        self.column = column
        self.freq_map = {} 
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X_copy = X.copy()
        X_copy[self.column] = X_copy[self.column].map(self.freq_map).fillna(0)
        return X_copy