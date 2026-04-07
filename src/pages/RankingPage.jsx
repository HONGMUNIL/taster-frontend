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
      <p className="page-desc"> 실제 랭킹 데이터입니다.</p>

      <div className="ranking-list">
        {rankingList.length === 0 ? (
          <div className="ranking-item">
            <p>표시할 랭킹 데이터가 없습니다.</p>
          </div>
        ) : (
          rankingList.map((place, index) => (
            <div key={place.place_id} className="ranking-item">
              <div>
                <strong>
                  {index + 1}위. {place.place_name}
                </strong>
                <p>베이지안 점수: {place.bayes_score}</p>
                <p>평균 평점: {place.avg_rating ?? "없음"}</p>
                <p>리뷰 수: {place.review_count}</p>

                <Link to={`/places/${place.place_id}`} className="button-link">
                  상세 보기
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}