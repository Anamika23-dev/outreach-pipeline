import axios from "axios";
 export async function searchPeople(domain) {
  try {
    const response = await axios.post(
      "https://api.prospeo.io/search-person",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: [domain]
            }
          },
          person_seniority: {
            include: ["Senior"]
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-KEY": process.env.PROSPEO_API_KEY
        }
      }
    );

    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

