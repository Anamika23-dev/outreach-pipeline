import axios from "axios";

export async function getCompanyByDomain(domain) {
  try {
    const response = await axios.post(
      "https://api.prospeo.io/search-company",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: [domain] 
            }
          }
        }
      },
      {
        headers: {
          "X-KEY": process.env.PROSPEO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log(
      error.response?.data || error.message
    );
  }
}

export async function findSimilarCompanies(
  industry,
  employeeRange
) {
  try {
    const response = await axios.post(
      "https://api.prospeo.io/search-company",
      {
        page: 1,
        filters: {
          company_industry: {
            include: [industry]
          },
//           company_headcount_range:  [
//     "10000_plus"
//   ]
        }
      },
      {
        headers: {
          "X-KEY": process.env.PROSPEO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log(
      error.response?.data || error.message
    );
  }
}