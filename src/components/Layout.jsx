import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

export default function Layout({ children }) {
    const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  function handleLogout() {
    logout();
    navigate("/");
  }

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

             {loggedIn ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <button type="button" className="nav-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}