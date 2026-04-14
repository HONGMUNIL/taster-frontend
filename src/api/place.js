import client from "./client";

export async function getPlaceList(params = {}) {
  const response = await client.get("/places", {
    params,
  });

  return response.data;
}



export async function getPlaceDetail(placeId) {
    
}