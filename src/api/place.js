import client from "./client";

const TOKEN_KEY = "access_token";

export async function getPlaceList(params = {}) {
  const response = await client.get("/places", {
    params,
  });
  return response.data;
}

export async function getPlaceDetail(placeId) {
  const response = await client.get(`/places/${placeId}`);
  return response.data;
}

export async function getAreaList() {
  const response = await client.get("/areas");
  return response.data;
}

export async function getCategoryList() {
  const response = await client.get("/categories");
  return response.data;
}

export async function createPlace(payload) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await client.post("/places", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}