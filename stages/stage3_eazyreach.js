import axios from "axios";
 export async function getAuthToken() {
  try {
    const response = await axios.post(
      "https://api.superflow.run/b2b/createAuthToken/",
      {
        clientId: process.env.EAZYREACH_CLIENT_ID,
        clientSecret: process.env.EAZYREACH_CLIENT_SECRET
      }
    );

    return response.data.authToken;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

 export async function getLinkedinEmails(linkedinUrl, token) {
  const response = await axios.post(
    "https://api.superflow.run/b2b/linkedin-emails",
    {
      linkedinUrl
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}


 export async function getBalance(token) {
  try {
    const response = await axios.get(
      "https://api.superflow.run/b2b/getGreenBalance",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
