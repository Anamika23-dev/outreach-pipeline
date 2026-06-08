import { configDotenv } from "dotenv";
configDotenv();

import fs from "fs";
import {getAuthToken,getLinkedinEmails,getBalance } from "./stages/stage3_eazyreach.js";
import { getCompanyByDomain,findSimilarCompanies } from "./stages/stage1_ocean.js";
import { searchPeople } from "./stages/stage2_prospeo.js";
import { sendTestEmail } from "./stages/stage4_brevo.js";

async function main() {

  try {
const seedDomain = process.argv[2];

if (!seedDomain) {
  console.log(
    "Usage: node index.js <domain>"
  );
  process.exit(1);
}
    console.log("\n=================================");
    console.log(" OUTREACH PIPELINE ");
    console.log("=================================\n");

    console.log(`Seed Domain: ${seedDomain}\n`);




    //finding similar companies based on seed companys industry and handling the rate limit error from prospects when aking api calls to find similar companies

let companies = [];

try {

  console.log(
    "Trying live company search..."
  );

  const companyData =
    await getCompanyByDomain(seedDomain);

  const seedCompany =
    companyData.results[0].company;

  console.log("Seed Company:");
  console.log(`Name: ${seedCompany.name}`);
  console.log(`Industry: ${seedCompany.industry}`);
  console.log(
    `Employee Range: ${seedCompany.employee_range}`
  );

  console.log(
    "\nFinding  Live similar companies..."
  );

  const similarCompaniesResponse =
    await findSimilarCompanies(
      seedCompany.industry,
      seedCompany.employee_range
    );

  companies =
    similarCompaniesResponse.results.slice(0, 5);

  console.log(
    `Found ${companies.length} companies`
  );

}
catch(error){

  console.log(
    "Using cached fallback companies due to API limitation."
  );

  companies = [
    { company: { name: "Amazon", domain: "amazon.com" } },
    { company: { name: "Microsoft", domain: "microsoft.com" } },
        { company: { name: "Google", domain: "google.com" } },

    { company: { name: "Meta", domain: "meta.com" } },
    { company: { name: "Semrush", domain: "semrush.com" } }
  ];
}


    let companiesProcessed = 0;
    let totalPeopleFound = 0;

    const prospects = [];


    //function to sleep for given ms
    function sleep(ms){
        return new Promise(resolve=>setTimeout(resolve,ms));

    }

    for (const item of companies) {
      const company = item.company;

      console.log("\n----------------------------------");
      console.log(`Company: ${company.name}`);
      console.log(`Domain: ${company.domain}`);

      try {
        const filePath = `./debug-data/${company.domain}.json`;

        if (!fs.existsSync(filePath)) {
          console.log(
            `Missing cached file: ${company.domain}.json`
          );
           await sleep(3000);//wait for 3 sec before processing the next company to avoid hitting the rate limit 
          continue;
        }



//rate limithandling when making actual API calls -if the rate limit is hit wait for 60 sec before retrying same company

let peopleResponse;

try {

  peopleResponse =
    await searchPeople(company.domain);

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      peopleResponse,
      null,
      2
    )
  );

  console.log(
    "Using live Prospeo people search."
  );

} catch (error) {

  console.log(
    "Using cached people data due to API limitation."
  );

  if (!fs.existsSync(filePath)) {
    console.log(
      `No cache available for ${company.domain}`
    );
    continue;
  }

  peopleResponse = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}

        companiesProcessed++;

        totalPeopleFound +=
          peopleResponse.results?.length || 0;

        console.log(
          `Found ${
            peopleResponse.results?.length || 0
          } people`
        );

        if (
          !peopleResponse ||
          !peopleResponse.results ||
          peopleResponse.results.length === 0
        ) {
          console.log("No people found.");
          continue;
        }

        const person =
          peopleResponse.results[0].person;

        console.log(
          `Decision Maker: ${person.full_name}`
        );

        console.log(
          `LinkedIn: ${person.linkedin_url}`
        );
        console.log(
  `Email: ${
    person.email?.email || "Not Available"
  }`
);

console.log(
  `Email Status: ${
    person.email?.status || "Unknown"
  }`
);

console.log(
  `Revealed: ${
    person.email?.revealed ?? false
  }`
);

        //use linkdin url to to prevent duplicates in prospects list
const existing = prospects.find(
  p => p.linkedin === person.linkedin_url
);



//prevent duplicates in prospects list
if(!existing){
       prospects.push({
  company: company.name,
  person: person.full_name,
  linkedin: person.linkedin_url,
  email:
    person.email?.email || "Not Available",
  emailStatus:
    person.email?.status || "Unknown",
  revealed:
    person.email?.revealed || false
});
      }
      } catch (error) {
        console.log(
          `Failed to process ${company.name}`
        );
      }
    }

    // CSV Export
    const csv =
  "Company,Person,LinkedIn,Email,EmailStatus,Revealed\n" +
  prospects
    .map(
      p =>
        `"${p.company}","${p.person}","${p.linkedin}","${p.email}","${p.emailStatus}","${p.revealed}"`
    )
    .join("\n");

    fs.writeFileSync(
      "./prospects.csv",
      csv
    );

    console.log(
      "\nprospects.csv generated successfully."
    );


    //check the ezuraech balance and enrich emails if the balance is sufficient

 const token = await getAuthToken();

const balanceResponse = await getBalance(token);

console.log("BALANCE:", balanceResponse);

if (balanceResponse > 0) {
  if (prospects.length > 0) {
  const firstLinkedIn =
    prospects[0].linkedin;

  const result =
    await getLinkedinEmails(
      firstLinkedIn,
      token
    );

  console.log(result);
}
} else {
  console.log(
    "Skipping email enrichment. Insufficient balance."
  );
}


//Test Brevo integration by sending a test email
const testEmail = "anamikapandey04655@gmail.com";
console.log("\n========== BREVO TEST ==========");
console.log(`Recipient: ${testEmail}`);
console.log("Sending email...");

//Attempt to send the test email and log the result
try {
await sendTestEmail(testEmail);
console.log("Email sent sucessfully");
}
catch(error){
   console.log(
     "Email delivery failed"
   );
}


    console.log("\n====================");
    console.log("PIPELINE SUMMARY");
    console.log("====================");

    console.log(
      `Companies Processed: ${companiesProcessed}`
    );

    console.log(
      `People Found: ${totalPeopleFound}`
    );

    console.log(
      `Prospects Exported: ${prospects.length}`
    );

    console.log(
      "\nPipeline completed successfully."
    );
  } catch (error) {
    console.error(
      "Pipeline Error:",
      error.response?.data || error.message
    );
  }
}

main();