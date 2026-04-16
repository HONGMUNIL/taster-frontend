import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPlace,
  getAreaList,
  getCategoryList,
} from "../api/place";

export default function PlaceCreatePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function fetchOptions() {
    setError("");

    const [areaResult, categoryResult] = await Promise.allSettled([
      getAreaList(),
      getCategoryList(),
    ]);

    if (areaResult.status === "fulfilled") {
      setAreas(areaResult.value);
    } else {
      console.error("지역 목록 조회 실패:", areaResult.reason);
    }

    if (categoryResult.status === "fulfilled") {
      setCategories(categoryResult.value);
    } else {
      console.error("카테고리 목록 조회 실패:", categoryResult.reason);
    }

    if (
      areaResult.status === "rejected" &&
      categoryResult.status === "rejected"
    ) {
      setError("지역과 카테고리 목록을 불러오지 못했습니다.");
    } else if (categoryResult.status === "rejected") {
      setError("카테고리 목록을 불러오지 못했습니다. 우선 지역만 선택할 수 있습니다.");
    } else if (areaResult.status === "rejected") {
      setError("지역 목록을 불러오지 못했습니다.");
    }

    setInitLoading(false);
  }

  fetchOptions();
}, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("가게 이름을 입력해주세요.");
      return;
    }

    if (!areaId) {
      setError("지역을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        area_id: Number(areaId),
        category_id: categoryId ? Number(categoryId) : null,
      };

      const createdPlace = await createPlace(payload);

      navigate(`/places/${createdPlace.id}`);
    } catch (err) {
      console.error("가게 등록 실패:", err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("가게 등록에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (initLoading) {
    return (
      <section className="page">
        <h2>가게 등록</h2>
        <p className="page-desc">등록 화면을 준비하는 중입니다...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>가게 등록</h2>
      <p className="page-desc">
        새 가게 정보를 입력하고 등록할 수 있습니다.
      </p>

      <form className="place-create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="place-name">가게 이름</label>
          <input
            id="place-name"
            type="text"
            placeholder="가게 이름 입력"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="area-id">지역</label>
          <select
            id="area-id"
            value={areaId}
            onChange={(event) => setAreaId(event.target.value)}
          >
            <option value="">지역 선택</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category-id">카테고리</label>
          <select
            id="category-id"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">카테고리 없음</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="button-link" disabled={loading}>
          {loading ? "등록 중..." : "가게 등록하기"}
        </button>
      </form>
    </section>
  );
}