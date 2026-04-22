import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMe } from "../api/auth";
import { getPlaceDetail } from "../api/place";
import {
  createReview,
  deleteReview,
  getReviewsByPlaceId,
  updateReview,
} from "../api/review";

const TOKEN_KEY = "access_token";

export default function PlaceDetailPage() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState("5");
  const [body, setBody] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState("5");
  const [editBody, setEditBody] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const isLoggedIn = !!localStorage.getItem(TOKEN_KEY);

  async function loadDetailData() {
    const [placeData, reviewData] = await Promise.all([
      getPlaceDetail(id),
      getReviewsByPlaceId(id),
    ]);

    setPlace(placeData);
    setReviews(reviewData);
  }

  useEffect(() => {
    async function fetchDetailData() {
      setLoading(true);
      setError("");

      try {
        await loadDetailData();

        if (isLoggedIn) {
          try {
            const me = await getMe();
            setCurrentUser(me);
          } catch (err) {
            console.error("내 정보 조회 실패:", err);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("상세 조회 실패:", err);
        setError("가게 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetailData();
  }, [id, isLoggedIn]);

  function formatRating(value) {
    if (value === null || value === undefined) {
      return "없음";
    }

    return Number(value).toFixed(1);
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "날짜 없음";
    }

    return new Date(dateString).toLocaleString("ko-KR");
  }

  function isMyReview(review) {
    if (!currentUser) {
      return false;
    }

    return review.author_email === currentUser.email;
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setSubmitError("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }

    if (body.trim().length < 10) {
      setSubmitError("리뷰는 최소 10자 이상 입력해주세요.");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        place_id: Number(id),
        rating: Number(rating),
        body: body.trim(),
      };

      await createReview(payload);
      await loadDetailData();

      setRating("5");
      setBody("");
      setSubmitSuccess("리뷰가 등록되었습니다.");
    } catch (err) {
      console.error("리뷰 작성 실패:", err);

      if (err.response?.data?.detail) {
        setSubmitError(err.response.data.detail);
      } else {
        setSubmitError("리뷰 작성에 실패했습니다.");
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  function handleEditStart(review) {
    setEditingReviewId(review.id);
    setEditRating(String(review.rating));
    setEditBody(review.body ?? "");
    setEditError("");
  }

  function handleEditCancel() {
    setEditingReviewId(null);
    setEditRating("5");
    setEditBody("");
    setEditError("");
  }

  async function handleEditSubmit(event, reviewId) {
    event.preventDefault();
    setEditError("");
    setSubmitSuccess("");

    if (editBody.trim().length < 10) {
      setEditError("리뷰는 최소 10자 이상 입력해주세요.");
      return;
    }

    try {
      setEditLoading(true);

      await updateReview(reviewId, {
        rating: Number(editRating),
        body: editBody.trim(),
      });

      await loadDetailData();
      handleEditCancel();
      setSubmitSuccess("리뷰가 수정되었습니다.");
    } catch (err) {
      console.error("리뷰 수정 실패:", err);

      if (err.response?.data?.detail) {
        setEditError(err.response.data.detail);
      } else {
        setEditError("리뷰 수정에 실패했습니다.");
      }
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(reviewId) {
    const confirmed = window.confirm("정말 이 리뷰를 삭제할까요?");

    if (!confirmed) {
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");
    setEditError("");

    try {
      setDeleteLoadingId(reviewId);

      await deleteReview(reviewId);
      await loadDetailData();

      if (editingReviewId === reviewId) {
        handleEditCancel();
      }

      setSubmitSuccess("리뷰가 삭제되었습니다.");
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);

      if (err.response?.data?.detail) {
        setSubmitError(err.response.data.detail);
      } else {
        setSubmitError("리뷰 삭제에 실패했습니다.");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <h2>가게 상세</h2>
        <p className="page-desc">데이터를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h2>가게 상세</h2>
        <p className="page-desc">{error}</p>
      </section>
    );
  }

  if (!place) {
    return (
      <section className="page">
        <h2>가게 상세</h2>
        <p className="page-desc">가게 정보가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>{place.name}</h2>
      <p className="page-desc">선택한 가게의 상세 정보입니다.</p>

      <div className="card detail-card">
        <p><strong>지역</strong>: {place.area_name}</p>
        <p><strong>카테고리</strong>: {place.category_name ?? "없음"}</p>
        <p><strong>평균 평점</strong>: {formatRating(place.avg_rating)}</p>
        <p><strong>리뷰 수</strong>: {place.review_count}개</p>
      </div>

      <section className="review-write-section">
        <h3>리뷰 작성</h3>

        {isLoggedIn ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label htmlFor="review-rating">별점</label>
              <select
                id="review-rating"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                <option value="5">5점</option>
                <option value="4">4점</option>
                <option value="3">3점</option>
                <option value="2">2점</option>
                <option value="1">1점</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="review-body">리뷰 내용</label>
              <textarea
                id="review-body"
                rows="5"
                placeholder="최소 10자 이상 입력해주세요."
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>

            {submitError && <p className="form-error">{submitError}</p>}
            {submitSuccess && <p className="form-success">{submitSuccess}</p>}

            <button
              type="submit"
              className="button-link review-submit-button"
              disabled={submitLoading}
            >
              {submitLoading ? "등록 중..." : "리뷰 등록하기"}
            </button>
          </form>
        ) : (
          <div className="card">
            <p>리뷰 작성은 로그인 후 가능합니다.</p>
            <Link to="/login" className="button-link">
              로그인하러 가기
            </Link>
          </div>
        )}
      </section>

      <section className="review-section">
        <h3>리뷰 목록</h3>

        {reviews.length === 0 ? (
          <div className="card">
            <p>아직 등록된 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div key={review.id} className="card review-card">
                {editingReviewId === review.id ? (
                  <form
                    className="review-edit-form"
                    onSubmit={(event) => handleEditSubmit(event, review.id)}
                  >
                    <div className="form-group">
                      <label>별점</label>
                      <select
                        value={editRating}
                        onChange={(event) => setEditRating(event.target.value)}
                      >
                        <option value="5">5점</option>
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>리뷰 내용</label>
                      <textarea
                        rows="4"
                        value={editBody}
                        onChange={(event) => setEditBody(event.target.value)}
                      />
                    </div>

                    {editError && <p className="form-error">{editError}</p>}

                    <div className="review-action-row">
                      <button
                        type="submit"
                        className="button-link review-submit-button"
                        disabled={editLoading}
                      >
                        {editLoading ? "수정 중..." : "수정 저장"}
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleEditCancel}
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p><strong>작성자</strong>: {review.author_email ?? "알 수 없음"}</p>
                    <p><strong>별점</strong>: {review.rating}</p>
                    <p><strong>리뷰</strong>: {review.body}</p>
                    <p><strong>작성일</strong>: {formatDate(review.created_at)}</p>

                    {isMyReview(review) && (
                      <div className="review-action-row">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handleEditStart(review)}
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(review.id)}
                          disabled={deleteLoadingId === review.id}
                        >
                          {deleteLoadingId === review.id ? "삭제 중..." : "삭제"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}