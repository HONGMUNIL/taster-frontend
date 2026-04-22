import client from "./client";

const TOKEN_KEY = "access_token";

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getReviewsByPlaceId(placeId) {
  const response = await client.get("/reviews", {
    params: {
      place_id: placeId,
    },
  });

  return response.data;
}

export async function createReview(payload) {
  const response = await client.post("/reviews", payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function updateReview(reviewId, payload) {
  const response = await client.put(`/reviews/${reviewId}`, payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function deleteReview(reviewId) {
  const response = await client.delete(`/reviews/${reviewId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getReviewsByUserId(userId) {
  const response = await client.get("/reviews", {
    params: {
      user_id: userId,
    },
  });

  return response.data;
}