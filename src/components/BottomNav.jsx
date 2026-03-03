import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  MapPin,
  BarChart3,
  PlusCircle,
  Newspaper,
} from "lucide-react";

export default function BottomNav({ onCreatePost }) {
  const items = [
    { to: "/", icon: Home, label: "Home", end: true },
    { to: "/news", icon: Newspaper, label: "News" },
    null, // FAB placeholder
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/near-me", icon: MapPin, label: "Near Me" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item, idx) => {
        if (item === null) {
          return (
            <button
              key="fab"
              className="bottom-nav-fab"
              onClick={onCreatePost}
              title="Post Report"
            >
              <PlusCircle size={28} strokeWidth={2} />
            </button>
          );
        }
        const { to, icon: Icon, label, end } = item;
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
