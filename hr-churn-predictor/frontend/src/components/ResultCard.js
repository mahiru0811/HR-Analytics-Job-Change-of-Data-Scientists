import React from 'react';
import { MODEL_OPTIONS } from '../constants';

function GaugeArc({ pct, color }) {
  const r = 52;
  const cx = 70, cy = 70;
  const circumference = Math.PI * r; // half circle
  const stroke = circumference * pct;
  const gap    = circumference - stroke;

  return (
    <svg viewBox="0 0 140 80" width="180" height="103">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="var(--border)" strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${stroke} ${gap}`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

function ProbBar({ label, value, color }) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontWeight: '600', color }}>{pct}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '3px',
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

const RISK_COLOR = {
 'Rất cao':    'var(--red)',
  'Cao':        'var(--orange)',
  'Trung bình': 'var(--yellow)',
  'Thấp':       'var(--green)',
};

export default function ResultCard({ result, loading }) {
  const s = {
    card: {
      background: 'var(--bg2)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    title: {
      fontSize: '0.78rem',
      fontWeight: '700',
      color: 'var(--text3)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    empty: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--text3)',
      fontSize: '0.88rem',
      lineHeight: '1.8',
    },
    spinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0',
    },
    gaugeWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      position: 'relative',
    },
    verdict: (color) => ({
      fontSize: '1rem',
      fontWeight: '700',
      color,
      textAlign: 'center',
    }),
    pct: (color) => ({
      fontFamily: 'var(--mono)',
      fontSize: '1.8rem',
      fontWeight: '700',
      color,
      lineHeight: 1,
    }),
    badge: (color) => ({
      display: 'inline-flex',
      padding: '3px 12px',
      borderRadius: '20px',
      background: `${color}22`,
      border: `1px solid ${color}66`,
      color,
      fontSize: '0.78rem',
      fontWeight: '600',
    }),
    divider: {
      height: '1px',
      background: 'var(--border)',
    },
    metaRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metaLabel: {
      fontSize: '0.78rem',
      color: 'var(--text3)',
    },
    metaVal: {
      fontSize: '0.82rem',
      fontWeight: '600',
      color: 'var(--text)',
    },
  };

  const modelInfo = MODEL_OPTIONS.find(m => m.value === result?.model_name);

  return (
    <div style={s.card}>
      <span style={s.title}>Kết quả dự đoán</span>

      {loading && (
        <div style={s.spinner}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: 'spin 0.9s linear infinite' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="3" />
            <path d="M 18 4 A 14 14 0 0 1 32 18" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {!loading && !result && (
        <div style={s.empty}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          Nhập thông tin ứng viên<br />và nhấn <strong style={{ color: 'var(--text2)' }}>Dự đoán</strong> để xem kết quả
        </div>
      )}

      {!loading && result && (() => {
        const isLeaving = result.prediction === 1;
        const displayPct = isLeaving ? result.probability_leave : result.probability_stay;
        const displayColor = isLeaving ? 'var(--red)' : 'var(--green)';
        const displayLabelText = isLeaving ? 'NGUY CƠ RỜI ĐI' : 'KHẢ NĂNG Ở LẠI';
        const riskColor  = RISK_COLOR[result.risk_level] || 'var(--yellow)';

        return (
          <>
            {/* Gauge */}
            <div style={s.gaugeWrap}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <GaugeArc pct={displayPct} color={displayColor} />
                <div style={{
                  position: 'absolute', bottom: '8px', left: '50%',
                  transform: 'translateX(-50%)', textAlign: 'center',
                }}>
                  <div style={s.pct(displayColor)}>{Math.round(displayPct * 100)}%</div> 
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '2px', fontWeight: 'bold' }}>{displayLabelText}</div>
                </div>
              </div>
              <div style={s.verdict(displayColor)}>
                {isLeaving ? '⚠️  Có khả năng chuyển việc' : '✅  Có khả năng ở lại'}
              </div>
              <span style={s.badge(riskColor)}>Mức độ rủi ro: {result.risk_level}</span>
            </div>

            <div style={s.divider} />

            {/* Probability bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ProbBar label="Ở lại (Stay)"          value={result.probability_stay}  color="var(--green)" />
              <ProbBar label="Chuyển việc (Leave)"   value={result.probability_leave} color="var(--red)" />
            </div>

            <div style={s.divider} />

            {/* Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={s.metaRow}>
                <span style={s.metaLabel}>Mô hình</span>
                <span style={{ ...s.metaVal, color: modelInfo?.color || 'var(--text)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                  {modelInfo?.label || result.model_name}
                </span>
              </div>
              <div style={s.metaRow}>
                <span style={s.metaLabel}>Độ tin cậy</span>
                <span style={s.metaVal}>{result.confidence}</span>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
