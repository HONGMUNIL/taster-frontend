import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <Link className ="logo" to="/">Taster</Link>

          <nav className="nav">
            <Link to="/">홈</Link>
            <Link to="/places/new">등록</Link>
            <Link to="/ranking">랭킹</Link>
            <Link to="/places">가게 목록</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}