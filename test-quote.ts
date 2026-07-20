import { submitQuoteRequest } from "./src/lib/quote.functions";

async function run() {
  try {
    const res = await submitQuoteRequest({
      data: {
        service: "Screen Printing",
        quantity: "50",
        turnaround: "Standard",
        turnaroundEstimate: "7-10 days",
        details: "Test details",
        fileNames: [],
        name: "Test Name",
        email: "test@example.com",
        captchaToken: "test-token",
        printLocations: 2,
      }
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error thrown:", err);
  }
}

run();
