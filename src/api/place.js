import client from "./client";

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
  const response = await client.get("/category");
  return response.data;
  
}

export async function createPlace(payload) {
  const response = await client.post("/places", payload);
  return response.data;
}




