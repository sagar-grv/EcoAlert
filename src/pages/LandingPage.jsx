import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center px-4">
                {/* Logo & Hero Icon */}
                <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/30 shadow-2xl shadow-primary/20 animate-pulse transition-all">
                    <span className="material-symbols-outlined text-primary text-6xl">eco</span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                    Protecting India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#12a146]">Environment</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-12 leading-relaxed">
                    EcoAlert is an AI-powered platform helping citizens detect, report, and combat environmental issues. Join the green revolution today.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-gradient-to-r from-primary to-[#12a146] text-white dark:text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all active:scale-[0.98] w-full sm:w-auto"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 glass-button text-slate-900 dark:text-white font-bold text-lg rounded-xl w-full sm:w-auto hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        Login to Account
                    </Link>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
                    <div className="glass-panel p-6 rounded-2xl">
                        <span className="material-symbols-outlined text-primary text-3xl mb-4">add_a_photo</span>
                        <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg mb-2">Instant Reporting</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Snap a photo and flag local environmental hazards in real-time.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <span className="material-symbols-outlined text-primary text-3xl mb-4">memory</span>
                        <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg mb-2">AI Verification</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Our Gemini AI instantly analyzes reports to prevent fake news.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <span className="material-symbols-outlined text-primary text-3xl mb-4">pin_drop</span>
                        <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg mb-2">Location Aware</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Discover and act upon critical ecological issues happening near you.</p>
                    </div>
                </div>
            </div>

            {/* Footer text */}
            <div className="absolute bottom-6 text-slate-500 text-sm font-medium z-10 text-center w-full">
                &copy; {new Date().getFullYear()} EcoAlert Platform. Built for a greener tomorrow.
            </div>
        </div>
    );
}
