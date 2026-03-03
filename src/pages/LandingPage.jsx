import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogIn, UserPlus, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120, damping: 12 }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const features = [
        { icon: <Shield size={20} />, text: "AI-Verified Reports" },
        { icon: <Zap size={20} />, text: "Real-time Alerts" },
        { icon: <Globe size={20} />, text: "Global Community" }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#07070a',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            {/* Animated Background Elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)', filter: 'blur(60px)' }}
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}
            >
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    style={{ display: 'inline-block', marginBottom: '1.5rem' }}
                >
                    <div style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, var(--green) 0%, #16a34a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <Leaf size={46} color="#fff" />
                    </div>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    style={{
                        fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                        fontWeight: 900,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to bottom, #fff 50%, rgba(255,255,255,0.7))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    EcoAlert
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    style={{
                        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxWidth: '560px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}
                >
                    The next-gen community platform for environmental activism.
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}> Report. Track. Change.</span>
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '4rem' }}
                >
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '1.1rem 2.8rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '100px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            boxShadow: '0 10px 30px rgba(255, 255, 255, 0.15)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        Get Started <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '1.1rem 2.8rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '100px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Sign Up
                    </button>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        padding: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        flexWrap: 'wrap'
                    }}
                >
                    {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 500 }}>
                            <span style={{ color: 'var(--green)' }}>{f.icon}</span>
                            {f.text}
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Floating Decorative Elements */}
            <AnimatePresence>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1],
                            x: Math.random() * 40 - 20,
                            y: Math.random() * 40 - 20
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        style={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            background: i % 2 === 0 ? 'var(--green)' : '#fff',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            zIndex: 0
                        }}
                    />
                ))}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.5 }}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600
                }}
            >
                Powering Change · Since 2024
            </motion.div>
        </div >
    );
}
