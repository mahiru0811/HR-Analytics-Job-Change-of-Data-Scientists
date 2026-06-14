import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  SelectField, CitySelect, SliderField, NumberField
} from './components/FormFields';
import ModelSelector from './components/ModelSelector';
import ResultCard    from './components/ResultCard';
import {
  GENDER_OPTIONS, EDUCATION_OPTIONS, MAJOR_OPTIONS, UNIVERSITY_OPTIONS,
  RELEVENT_EXP_OPTIONS, EXPERIENCE_OPTIONS, LAST_JOB_OPTIONS,
  COMPANY_SIZE_OPTIONS, COMPANY_TYPE_OPTIONS, CITY_LIST, API_URL,
} from './constants';

// ── Initial state ─────────────────────────────────────────────────────────────
const INIT = {
  gender: '', education_level: '', major_discipline: '', enrolled_university: '',
  relevent_experience: '', experience: '', last_new_job: '',
  company_size: '', company_type: '',
  city: '', city_development_index: 0.72, training_hours: null,
};

// ── Group config ──────────────────────────────────────────────────────────────
const GROUPS = [
  { id: 'demo',     label: 'Nhân khẩu học & Học vấn' },
  { id: 'work',     label: 'Kinh nghiệm làm việc' },
  { id: 'company',  label: 'Thông tin công ty' },
  { id: 'geo',      label: 'Địa lý & Đào tạo' },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid var(--border)',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg2)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px', height: '32px',
    background: 'linear-gradient(135deg, #4f8ef7 0%, #a78bfa 100%)',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px',
  },
  logoText: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: 'var(--text)',
    letterSpacing: '-0.01em',
  },
  logoSub: {
    fontSize: '0.9rem',
    color: 'var(--text3)',
    marginLeft: '0px',
    marginTop: '-2px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'var(--text3)',
  },
  dot: (color) => ({
    width: '7px', height: '7px', borderRadius: '50%',
    background: color, display: 'inline-block',
  }),
  main: {
    display: 'flex',
    flex: 1,
    gap: '24px',
    padding: '28px 32px',
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  left: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: 0,
  },
  right: {
    width: '320px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'sticky',
    top: '76px',
    alignSelf: 'flex-start',
  },
  card: {
    background: 'var(--bg2)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg3)',
  },
  cardIcon: {
    fontSize: '1rem',
  },
  cardTitle: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text)',
  },
  cardBody: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  sideCard: {
    background: 'var(--bg2)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  predictBtn: (loading) => ({
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius)',
    border: 'none',
    background: loading
      ? 'var(--bg3)'
      : 'linear-gradient(135deg, #4f8ef7 0%, #6366f1 100%)',
    color: loading ? 'var(--text3)' : '#fff',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    letterSpacing: '0.02em',
    transition: 'all var(--transition)',
    boxShadow: loading ? 'none' : '0 4px 16px rgba(79,142,247,0.35)',
    fontFamily: 'var(--font)',
  }),
  resetBtn: {
    width: '100%',
    padding: '9px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    background: 'transparent',
    color: 'var(--text3)',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    transition: 'all var(--transition)',
  },
  companyNote: {
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.25)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: '#fbbf24',
    lineHeight: '1.5',
  },
  errorBox: {
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '0.8rem',
    color: '#f87171',
    lineHeight: '1.5',
  },
  themeBtn: {
    background: 'var(--bg3)',
    border: '1.5px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '20px',
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontFamily: 'var(--font)',
    marginRight: '16px',
    transition: 'all var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [form,      setForm]      = useState(INIT);
  const [model,     setModel]     = useState('xgboost');
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'ok' | 'error' | 'unknown'
  const [isLightMode, setIsLightMode] = useState(true);
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);
  // Check API on mount
  React.useEffect(() => {
    axios.get(`${API_URL}/`)
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('error'));
  }, []);

  const set = useCallback((key, val) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map empty string to null for optional fields
      const features = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
      );
      const resp = await axios.post(`${API_URL}/predict`, {
        model_name: model,
        features,
      });
      setResult(resp.data);
    } catch (e) {
      const msg = e.response?.data?.detail || e.message || 'Lỗi không xác định';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INIT);
    setResult(null);
    setError(null);
  };

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <header style={S.header}>
        <div>
          <div style={S.logo}>
            <span style={S.logoText}>HR Analytics: Job Change of Data Scientists</span>
          </div>
          <div style={S.logoSub}>Dự đoán khả năng chuyển việc của Data Scientist</div>
        </div>
        <div style={S.headerRight}>

         
          <button style={S.themeBtn} onClick={() => setIsLightMode(!isLightMode)}>
            {isLightMode ? 'Darkmode' : 'Lightmode'}
          </button>
         

         
          <span style={S.dot(apiStatus === 'ok' ? 'var(--green)' : apiStatus === 'error' ? 'var(--red)' : 'var(--yellow)')} /> {/* thay đổi: dùng biến màu */}
          {apiStatus === 'ok' ? 'API kết nối' : apiStatus === 'error' ? 'API chưa kết nối' : 'Đang kiểm tra...'}
        </div>
      </header>

      <main style={S.main}>
        {/* ── LEFT: Form ── */}
        <div style={S.left}>

          {/* Group 1: Demographics */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              
              <span style={S.cardTitle}>{GROUPS[0].label}</span>
            </div>
            <div style={S.cardBody}>
              <div style={S.grid2}>
                <SelectField
                  label="Giới tính (Gender)"
                  value={form.gender}
                  onChange={v => set('gender', v)}
                  options={GENDER_OPTIONS}
                />
                <SelectField
                  label="Trình độ học vấn (Education)"
                  value={form.education_level}
                  onChange={v => set('education_level', v)}
                  options={EDUCATION_OPTIONS}
                />
              </div>
              <div style={S.grid2}>
                <SelectField
                  label="Chuyên ngành (Major)"
                  value={form.major_discipline}
                  onChange={v => set('major_discipline', v)}
                  options={MAJOR_OPTIONS}
                />
                <SelectField
                  label="Trạng thái học ĐH (University)"
                  value={form.enrolled_university}
                  onChange={v => set('enrolled_university', v)}
                  options={UNIVERSITY_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* Group 2: Work Experience */}
          <div style={S.card}>
            <div style={S.cardHeader}>
             
              <span style={S.cardTitle}>{GROUPS[1].label}</span>
            </div>
            <div style={S.cardBody}>
              <SelectField
                label="Kinh nghiệm liên quan (Relevant Experience)"
                value={form.relevent_experience}
                onChange={v => set('relevent_experience', v)}
                options={RELEVENT_EXP_OPTIONS}
              />
              <div style={S.grid2}>
                <SelectField
                  label="Số năm kinh nghiệm (Experience)"
                  value={form.experience}
                  onChange={v => set('experience', v)}
                  options={EXPERIENCE_OPTIONS}
                />
                <SelectField
                  label="Số năm kể từ công việc cũ (Last New Job)"
                  value={form.last_new_job}
                  onChange={v => set('last_new_job', v)}
                  options={LAST_JOB_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* Group 3: Company */}
          <div style={S.card}>
            <div style={S.cardHeader}>
             
              <span style={S.cardTitle}>{GROUPS[2].label}</span>
            </div>
            <div style={S.cardBody}>
              <div style={S.companyNote}>
                 Các trường bên dưới <strong>không bắt buộc</strong>. Nếu không điền, pipeline sẽ tự xử lý là <em>Unknown</em>.
              </div>
              <div style={S.grid2}>
                <SelectField
                  label="Quy mô công ty (Company Size)"
                  value={form.company_size}
                  onChange={v => set('company_size', v)}
                  options={COMPANY_SIZE_OPTIONS}
                />
                <SelectField
                  label="Loại hình công ty (Company Type)"
                  value={form.company_type}
                  onChange={v => set('company_type', v)}
                  options={COMPANY_TYPE_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* Group 4: Geography */}
          <div style={S.card}>
            <div style={S.cardHeader}>
             
              <span style={S.cardTitle}>{GROUPS[3].label}</span>
            </div>
            <div style={S.cardBody}>
              <CitySelect
                value={form.city}
                onChange={v => set('city', v)}
                cities={CITY_LIST}
              />
              <SliderField
                label="Chỉ số phát triển thành phố (City Development Index)"
                hint="Chỉ số từ 0.45 (đang phát triển) đến 0.95 (phát triển cao)"
                min={0.45}
                max={0.95}
                step={0.01}
                value={form.city_development_index}
                onChange={v => set('city_development_index', v)}
                format={v => v.toFixed(3)}
              />
              <NumberField
                label="Số giờ đào tạo (Training Hours)"
                hint="Tổng số giờ tham gia chương trình đào tạo"
                min={1}
                max={336}
                value={form.training_hours}
                onChange={v => set('training_hours', v)}
                unit="giờ"
              />
            </div>
          </div>

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div style={S.right}>

          {/* Model selector */}
          <div style={S.sideCard}>
            <ModelSelector value={model} onChange={setModel} />
          </div>

          {/* Predict button */}
          <div style={S.sideCard}>
            {error && <div style={S.errorBox}>⚠️ {error}</div>}
            <button
              style={S.predictBtn(loading)}
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? '  Đang dự đoán...' : '  Dự đoán Khả năng Chuyển việc'}
            </button>
            <button
              style={S.resetBtn}
              onClick={handleReset}
              onMouseEnter={e => { e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border2)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.borderColor = 'var(--border)'; }}
            >
              ↺  Nhập lại
            </button>
          </div>

          {/* Result card */}
          <ResultCard result={result} loading={loading} />

        </div>
      </main>
    </div>
  );
}
