import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../api/auth";
import { getReviewsByUserId } from "../api/review";

const TOKEN_KEY = "access_token";

export default function MyPage() {
  const [me, setMe] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    async function fetchMyPageData() {
      setLoading(true);
      setError("");

      if (!isLoggedIn) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const meData = await getMe();
        setMe(meData);

        const reviewData = await getReviewsByUserId(meData.id);
        setMyReviews(reviewData);
      } catch (err) {
        console.error("마이페이지 조회 실패:", err);

        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("마이페이지 정보를 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMyPageData();
  }, [isLoggedIn]);

  function formatDate(dateString) {
    if (!dateString) {
      return "날짜 없음";
    }

    return new Date(dateString).toLocaleString("ko-KR");
  }

  if (loading) {
    return (
      <section className="page">
        <h2>마이페이지</h2>
        <p className="page-desc">내 정보를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h2>마이페이지</h2>
        <p className="page-desc">{error}</p>
        {!isLoggedIn && (
          <Link to="/login" className="button-link">
            로그인하러 가기
          </Link>
        )}
      </section>
    );
  }

  return (
    <section className="page">
      <h2>마이페이지</h2>
      <p className="page-desc">현재 로그인한 사용자 정보와 내가 작성한 리뷰 목록입니다.</p>

      <div className="card mypage-card">
        <p><strong>이메일</strong>: {me?.email}</p>
        <p><strong>내 리뷰 수</strong>: {myReviews.length}개</p>
      </div>

      <section className="review-section">
        <h3>내가 쓴 리뷰</h3>

        {myReviews.length === 0 ? (
          <div className="card">
            <p>아직 작성한 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="review-list">
            {myReviews.map((review) => (
              <div key={review.id} className="card review-card">
                <p><strong>가게 ID</strong>: {review.place_id}</p>
                <p><strong>별점</strong>: {review.rating}</p>
                <p><strong>리뷰</strong>: {review.body}</p>
                <p><strong>작성일</strong>: {formatDate(review.created_at)}</p>

                <Link to={`/places/${review.place_id}`} className="button-link">
                  가게 보러 가기
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}