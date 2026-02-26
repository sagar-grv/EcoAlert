import { NavLink, useNavigate } from 'react-router-dom';

export default function BottomNav({ onCreatePost }) {
    const navigate = useNavigate();

    const linkClass = (isActive) =>
        `flex flex-1 flex-col items-center justify-end gap-1 transition-colors group ${isActive
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-400 dark:text-[#9fb7a8] hover:text-slate-900 dark:hover:text-white'
        }`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t px-6 pb-8 pt-3 z-40">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined ${isActive ? 'ms-fill' : ''}`}>home</span>
                            <span className="text-[10px] font-medium">Home</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/explore" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined ${isActive ? 'ms-fill' : ''}`}>explore</span>
                            <span className="text-[10px] font-bold">Explore</span>
                        </>
                    )}
                </NavLink>

                <div className="relative -top-8">
                    <button
                        onClick={onCreatePost}
                        className="bg-primary w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white border-4 border-white/50 dark:border-surface-dark/50 active:scale-[0.95] transition-transform glow-subtle"
                    >
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>

                <NavLink to="/near-me" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined ${isActive ? 'ms-fill' : ''}`}>near_me</span>
                            <span className="text-[10px] font-medium">Near Me</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined ${isActive ? 'ms-fill' : ''}`}>person</span>
                            <span className="text-[10px] font-medium">Profile</span>
                        </>
                    )}
                </NavLink>
            </div>
        </nav>
    );
}
