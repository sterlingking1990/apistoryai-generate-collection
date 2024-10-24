#!/usr/bin/env node
// Import necessary packages
const fs = require("fs-extra");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to read schema.py and generate collection.json
async function generateAPICollection(schemaPath) {
  try {
    // 1. Read schema.py file
    const schemaContent = await fs.readFile(schemaPath, "utf8");
    console.log("Schema file loaded...");

    // 2. Prepare the prompt
    const prompt = `
# Here is the schema.py file:

${schemaContent}

# Task:
Generate a collection.json that defines API endpoints based on the provided schema.py. Do not add headline text or comments or explanation to the json file. The collection should have the following format:

{
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "description": "Retrieve a list of users",
      "schema": {
        "name": "users",
        "columns": [
          { "name": "name", "type": "string" },
          { "name": "email", "type": "string" },
          { "name": "msisdn", "type": "string" }
        ],
        "description": "Schema for users with personal information."
      }
    },
    {
      "path": "/subscriptions_by_users/{user_id}",
      "method": "GET",
      "description": "Get subscriptions for a specific user",
      "parameters": [
        { "name": "user_id", "in": "path", "type": "integer", "required": true }
      ],
      "schema": {
        "name": "subscriptions",
        "columns": [
          { "name": "id", "type": "integer" },
          { "name": "service", "type": "string" },
          { "name": "service_duration", "type": "string" },
          { "name": "date_subscribed", "type": "date" },
          { "name": "description", "type": "string" },
          { "name": "user_id", "type": "integer" },
          { "name": "end_date", "type": "date" }
        ],
        "description": "Schema capturing user-specific subscriptions."
      }
    }
  ]
}
`;

    // 3. Call OpenAI GPT API to generate collection.json
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert API designer with deep knowledge of database schemas and ORM frameworks like SQLAlchemy. You excel at generating detailed and accurate API specifications and collections from database models.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4",
      max_tokens: 1500,
    });

    // 4. Save the response to collection.json
    const messageContent = response.choices[0].message.content;
    const jsonMatch = messageContent.match(/{[\s\S]*}/);
    var cleanedJson = "";
    if (jsonMatch) {
      cleanedJson = jsonMatch[0]; // This contains just the JSON
      console.log(cleanedJson);
    } else {
      console.log("No valid JSON found in the response.");
    }
    // const generatedJson = JSON.parse(
    //   response.data.choices[0].message.content.trim()
    // );

    await fs.writeFile("collection.json", cleanedJson);
    console.log("collection.json generated successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Export the function for use in other modules
module.exports = {
  generateAPICollection,
};

// Check for command-line argument and run the function if invoked via CLI
if (require.main === module) {
  const schemaPath = process.argv[2]; // Get schema path from command line arguments

  if (!schemaPath) {
    console.error("Please provide the path to the schema.py file.");
    process.exit(1);
  }

  // Run the function to generate API collection
  generateAPICollection(schemaPath);
}
