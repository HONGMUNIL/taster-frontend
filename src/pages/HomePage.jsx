import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <section className= "page">
            <h2>오사카 맛집을 찾는 가장 쉬운 방법</h2>
            <p className="page-desc">
                지역별 맛집, 랭킹, 리뷰를 한번에 확인하는 Taster
            </p>

            <div className="card-list">
                <div className="card">
                    <h3>지역별 탐색</h3>
                    <p>난바, 우메다, 신사이바시 같은 지역 기준</p>
                </div>
                
                <div className="card">
                    <h3>랭킹</h3>
                    <p>평점과 리뷰 수 기반의 랭킹 화면으로 이동</p>
                    <Link to="/ranking" className="button-link">
                        랭킹 보러가기
                    </Link>
                </div>

                <div className="card">
                    <h3>상세 페이지 예시</h3>
                    <p>맛집 상세 화면 자리도 만들자</p>
                    <Link to="/places/1" className="button-link">
                        상세 예시 보기
                    </Link>
                </div>
            </div>
        </section>
    )
}