import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

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

    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상으로 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (err) {
        console.error("회원가입 실패:", err);
         setError(getApiErrorMessage(err, "회원가입에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <h2>회원가입</h2>
      <p className="page-desc">
        이메일과 비밀번호로 계정을 만들 수 있습니다.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signup-email">이메일</label>
          <input
            id="signup-email"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password-check">비밀번호 확인</label>
          <input
            id="signup-password-check"
            type="password"
            placeholder="비밀번호 다시 입력"
            value={passwordCheck}
            onChange={(event) => setPasswordCheck(event.target.value)}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="button-link auth-submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <p className="auth-link-text">
          이미 계정이 있으면 <Link to="/login">로그인</Link>
        </p>
      </form>
    </section>
  );
}