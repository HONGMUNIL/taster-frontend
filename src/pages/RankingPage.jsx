import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRankingList } from "../api/ranking";

export default function RankingPage() {
  const [rankingList, setRankingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRanking() {
      try {
        const data = await getRankingList();
        setRankingList(data);
      } catch (err) {
        console.error("랭킹 조회 실패:", err);
        setError("랭킹 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  function formatScore(score) {
    return Number(score).toFixed(2);
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
        <h2>맛집 랭킹</h2>
        <p className="page-desc">데이터를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h2>맛집 랭킹</h2>
        <p className="page-desc">{error}</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>맛집 랭킹</h2>
      <p className="page-desc">
        리뷰 수와 평균 평점을 함께 반영한 Taster 추천 순위입니다.
      </p>

      <div className="ranking-list">
        {rankingList.length === 0 ? (
          <div className="ranking-item">
            <p>표시할 랭킹 데이터가 없습니다.</p>
          </div>
        ) : (
          rankingList.map((place, index) => (
            <div key={place.place_id} className="ranking-item">
              <div className="ranking-top">
                <span className="rank-badge">{index + 1}위</span>
                <strong className="place-name">{place.place_name}</strong>
              </div>

              <div className="ranking-meta">
                <p>Taster 점수: {formatScore(place.bayes_score)}</p>
                <p>평균 평점: {formatRating(place.avg_rating)}</p>
                <p>리뷰 수: {place.review_count}개</p>
              </div>

              <Link to={`/places/${place.place_id}`} className="button-link">
                상세 보기
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}