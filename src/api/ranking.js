import client from "./client";

export async function getRankingList(limit = 10) {
  const response = await client.get("/rankings", {
    params: {
      limit,
    },
  });

  return response.data;
}