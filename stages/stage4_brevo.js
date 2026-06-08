import axios from "axios";
  export async function sendTestEmail()
 {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Codestar Labs",
          email: "founder@codestarlabs.online"
        },
        to: [
          {
            email: "anamikapandey04655@gmail.com",
            
          }
        ],
        subject: "Brevo Test",
        htmlContent: "<h1>Brevo API Working</h1>"
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

