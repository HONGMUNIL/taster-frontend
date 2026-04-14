import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlaceList } from "../api/place";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("avg_rating");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true);
      setError("");

      try {
        const data = await getPlaceList({
          q: searchKeyword || undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
          limit: 20,
        });

        setPlaces(data);
      } catch (err) {
        console.error("가게 목록 조회 실패:", err);
        setError("가게 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [searchKeyword, sortBy, sortOrder]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setSearchKeyword(searchInput.trim());
  }

  function formatRating(rating) {
    if (rating === null || rating === undefined) {
      return "없음";
    }
    return Number(rating).toFixed(1);
  }

  if (loading) {
    return (
      <section className="page">
        <h2>가게 목록</h2>
        <p className="page-desc">가게 목록을 불러오는 중입니다...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h2>가게 목록</h2>
        <p className="page-desc">{error}</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>가게 목록</h2>
      <p className="page-desc">
        이름 검색과 정렬로 가게를 탐색할 수 있습니다.
      </p>

      <form className="place-filter-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="가게 이름 검색"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="avg_rating">평점순</option>
          <option value="review_count">리뷰 많은 순</option>
          <option value="name">이름순</option>
        </select>

        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>

        <button type="submit" className="button-link">
          검색
        </button>
      </form>

      {places.length === 0 ? (
        <div className="card">
          <p>조건에 맞는 가게가 없습니다.</p>
        </div>
      ) : (
        <div className="place-list">
          {places.map((place) => (
            <div key={place.id} className="card place-card">
              <h3>{place.name}</h3>
              <p><strong>지역</strong>: {place.area_name}</p>
              <p><strong>카테고리</strong>: {place.category_name ?? "없음"}</p>
              <p><strong>평균 평점</strong>: {formatRating(place.avg_rating)}</p>
              <p><strong>리뷰 수</strong>: {place.review_count}개</p>

              <Link to={`/places/${place.id}`} className="button-link">
                상세 보기
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}