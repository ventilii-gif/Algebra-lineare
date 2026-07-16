import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navGroups } from "../nav";

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <NavLink to="/" className="sidebar-brand" style={{ marginBottom: 0 }}>
          Algebra<span>Lineare</span>
        </NavLink>
        <button className="btn secondary" onClick={() => setOpen((o) => !o)}>
          Menu
        </button>
      </div>

      <nav className={`sidebar ${open ? "open" : ""}`}>
        <NavLink to="/" className="sidebar-brand">
          Algebra<span>Lineare</span>
        </NavLink>
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="nav-group-title">{group.title}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
