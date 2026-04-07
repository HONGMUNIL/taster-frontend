import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">Taster</h1>

          <nav className="nav">
            <Link to="/">홈</Link>
            <Link to="/ranking">랭킹</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}