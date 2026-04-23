import dotenv from 'dotenv';
dotenv.config();

// Load the key from your .env file
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing from your .env file!");
  process.exit(1);
}

console.log("Testing Resend API...");

try {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'hello@alhamdashino.com',
      to: 'gideon.akussah1234@gmail.com', 
      subject: 'Resend Smoke Test - alhamdashino.com',
      html: '<p>This is a smoke test from your Najat E-commerce app!</p>'
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log("✅ Email sent successfully!");
    console.log("Response:", data);
  } else {
    console.error("❌ Failed to send email.");
    console.error("Error details:", data);
  }
} catch (error) {
  console.error("❌ Network or fetch error:", error);
}