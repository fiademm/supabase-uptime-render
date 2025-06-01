// Import dependencies
const express = require("express");
const cron = require("node-cron");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route to verify the service is live
app.get("/", (_, res) => {
  res.send("✅ Supabase Cron Job Service is running.");
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🌐 Express server is running on port ${PORT}`);
});

// Schedule a task to run every Monday and Thursday at 9:00 AM UTC
cron.schedule("0 9 * * 1,4", async () => {
  console.log(
    "⏳ Running scheduled Supabase ping task at",
    new Date().toISOString()
  );

  try {
    // Ping the Supabase database by selecting a record from the 'pings' table
    const { data, error } = await supabase
      .from("pings") // ✅ This should match your table name
      .select("id")
      .limit(1);

    if (error) {
      console.error("❌ Error pinging Supabase:", error);
    } else {
      console.log(
        "✅ Supabase ping successful:",
        data,
        "at",
        new Date().toISOString()
      );
    }
  } catch (err) {
    console.error("❌ Failed to ping Supabase:", err);
  }
});
