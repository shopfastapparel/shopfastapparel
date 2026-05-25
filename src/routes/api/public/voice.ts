import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = "+18449102203";

export const Route = createFileRoute("/api/public/voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData();
        const speechResult = formData.get("SpeechResult")?.toString().toLowerCase() || "";
        const callerPhone = formData.get("From")?.toString() || "";

        let responseText = "Thanks for calling Fast Apparel! I'm an AI assistant. How can I help you today?";
        let shouldSendSms = false;
        let hangup = false;

        if (speechResult) {
          if (speechResult.includes("quote") || speechResult.includes("price") || speechResult.includes("cost") || speechResult.includes("how much") || speechResult.includes("yes") || speechResult.includes("sure")) {
            responseText = "I can definitely help with that. I just texted you a link to our quote form so we can get you an exact price and mockup. Is there anything else you need?";
            shouldSendSms = true;
          } else if (speechResult.includes("where") || speechResult.includes("located") || speechResult.includes("location") || speechResult.includes("address")) {
            responseText = "We are a home-based print shop located in Lawrenceville, Georgia. We offer free local delivery within 10 miles, and free shipping on orders over $149. Would you like me to text you a link to request a quote?";
          } else if (speechResult.includes("turnaround") || speechResult.includes("how long") || speechResult.includes("time") || speechResult.includes("fast")) {
            responseText = "Our standard turnaround time is 7 days from art approval. We also offer rush production if you need it sooner. Would you like me to text you a link to our quote form?";
          } else if (speechResult.includes("no") || speechResult.includes("goodbye") || speechResult.includes("bye") || speechResult.includes("nothing")) {
            responseText = "Alright, thanks for calling Fast Apparel! Have a great day.";
            hangup = true;
          } else {
            responseText = "I'm sorry, I didn't quite catch that. You can ask me about our location, turnaround time, or request a quote.";
          }
        }

        // Send the SMS via Twilio REST API
        if (shouldSendSms && callerPhone) {
          const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
          try {
            await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                To: callerPhone,
                From: TWILIO_PHONE,
                Body: "Here is the link to request a free quote and mockup from Fast Apparel! https://shopfastapparel.com/quote"
              })
            });
          } catch (e) {
            console.error("Failed to send SMS:", e);
          }
        }

        // Generate TwiML XML Response
        let twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n`;
        if (hangup) {
          twiml += `  <Say voice="Polly.Matthew-Neural">${responseText}</Say>\n  <Hangup />\n`;
        } else {
          twiml += `  <Gather input="speech" action="/api/public/voice" speechTimeout="auto" enhanced="true">\n    <Say voice="Polly.Matthew-Neural">${responseText}</Say>\n  </Gather>\n`;
          // Fallback if they don't speak
          twiml += `  <Say voice="Polly.Matthew-Neural">We didn't receive any input. Goodbye!</Say>\n  <Hangup />\n`;
        }
        twiml += `</Response>`;

        return new Response(twiml, {
          headers: {
            "Content-Type": "text/xml"
          }
        });
      }
    }
  }
});
