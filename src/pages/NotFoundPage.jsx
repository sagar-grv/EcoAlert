import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '70vh', textAlign: 'center', padding: '2rem 1rem',
        }}>
            <div style={{
                fontSize: '6rem', fontWeight: 900, fontFamily: 'Outfit, Inter, sans-serif',
                background: 'linear-gradient(135deg, var(--green), var(--green-400))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '-0.5rem',
            }}>
                404
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                Page Not Found
            </div>
            <p style={{ color: 'var(--text-sub)', maxWidth: 380, lineHeight: 1.6, fontSize: '0.9rem' }}>
                Looks like you've wandered off the trail.
                The page you're looking for doesn't exist or has been moved.
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 28px', borderRadius: 999,
                    background: 'var(--green)', color: '#fff', fontWeight: 700,
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <MapPin size={16} /> Go Home
            </button>
        </div>
    );
}
