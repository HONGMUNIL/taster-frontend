import { useParams } from "react-router-dom";

export default function PlaceDetailPage(){
    const { id } = useParams();

    return(
        <section className="page">
            <h2>맛집 상세 페이지</h2>
            <p className="page-desc">현재 맛집 id는 {id}다</p>

            <div className="card">
                <h3>가게 정보</h3>
                <p>여기 이름 주소 평점 카테고리 리뷰목록이 들어간다</p>
            </div>
        </section>
    )
}