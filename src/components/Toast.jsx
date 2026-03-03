// ─── Toast Notification Component ───────────────────────────
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
};

const COLORS = {
    success: 'var(--green)',
    error: '#ef4444',
    info: '#60a5fa',
};

export default function Toast({ toast }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [toast]);

    if (!toast) return null;

    return (
        <div
            className="toast-container"
            style={{
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 99999,
                pointerEvents: 'none',
            }}
        >
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px',
                background: 'rgba(17, 17, 22, 0.95)',
                border: `1px solid ${COLORS[toast.type] || COLORS.success}40`,
                borderRadius: '999px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
                color: COLORS[toast.type] || COLORS.success,
                fontWeight: 600, fontSize: '0.875rem',
                whiteSpace: 'nowrap',
            }}>
                {ICONS[toast.type] || ICONS.success}
                <span style={{ color: 'var(--text)' }}>{toast.message}</span>
            </div>
        </div>
    );
}
