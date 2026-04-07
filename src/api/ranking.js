import client from "./client";

export async function getRankingList() {
    const response = await client.get("/rankings");
    return response.data;
    
}