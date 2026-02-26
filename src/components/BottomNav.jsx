import { NavLink, useNavigate } from 'react-router-dom';

export default function BottomNav({ onCreatePost }) {
    const navigate = useNavigate();

    const linkClass = (isActive) =>
        `flex flex-1 flex-col items-center justify-end gap-1 transition-colors group ${isActive
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-400 dark:text-[#9fb7a8] hover:text-slate-900 dark:hover:text-white'
        }`;

    return (
        <nav className="fixed bottom-0 w-full z-50 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#1d2620] pb-5 pt-3 px-4 shadow-lg">
            <div className="flex justify-between items-end max-w-md mx-auto">
                <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isActive ? 'ms-fill' : ''}`}>home</span>
                            <p className="text-[10px] font-medium leading-none">Home</p>
                        </>
                    )}
                </NavLink>

                <NavLink to="/near-me" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isActive ? 'ms-fill' : ''}`}>map</span>
                            <p className="text-[10px] font-medium leading-none">Map</p>
                        </>
                    )}
                </NavLink>

                {/* Center FAB */}
                <button
                    onClick={onCreatePost}
                    className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-[#9fb7a8] hover:text-slate-900 dark:hover:text-white transition-colors group relative -top-5"
                >
                    <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-white dark:border-[#1d2620]">
                        <span className="material-symbols-outlined text-3xl text-white dark:text-[#121714]">add</span>
                    </div>
                    <p className="text-[10px] font-medium leading-none mt-1">Report</p>
                </button>

                <NavLink to="/analysis" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isActive ? 'ms-fill' : ''}`}>bar_chart</span>
                            <p className="text-[10px] font-medium leading-none">Stats</p>
                        </>
                    )}
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isActive ? 'ms-fill' : ''}`}>person</span>
                            <p className="text-[10px] font-medium leading-none">Profile</p>
                        </>
                    )}
                </NavLink>
            </div>
        </nav>
    );
}
