import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getApiErrorMessage(err, fallbackMessage) {
  if (err.response?.data?.detail) {
    return err.response.data.detail;
  }

  if (err.response?.data?.error?.message) {
    return err.response.data.error.message;
  }

  if (err.message) {
    return err.message;
  }

  return fallbackMessage;
}

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate("/");
    } catch (err) {
         console.error("로그인 실패:", err);
        setError(getApiErrorMessage(err, "로그인에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <h2>로그인</h2>
      <p className="page-desc">
        이메일과 비밀번호를 입력해서 로그인할 수 있습니다.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="button-link auth-submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="auth-link-text">
          아직 회원이 아니면 <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </section>
  );
}