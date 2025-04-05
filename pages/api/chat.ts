import { NextApiRequest, NextApiResponse } from "next";
import { ChatSecret } from "secretai";
import fs from "fs";
import path from "path";
import { getGranterGrants, getGranteeGrants } from "../../utils/db";

// Initialize SecretAI Chat
const secretAI = new ChatSecret({
  apiKey: process.env.SECRET_AI_API_KEY || "",
  base_url: "https://secretai1.scrtlabs.com:21434",
  model: "deepseek-r1:70b",
  temperature: 1.0,
});

const createContext = async () => {
  const granterGrants = await getGranterGrants();
  const granteeGrants = await getGranteeGrants();

  const granterGrantsText = granterGrants
    .map(
      (grant: any) =>
        `Granter: ${grant.granter}, Permission: ${grant.permission}, Expiration: ${grant.expiration}`
    )
    .join("\n");

  const granteeGrantsText = granteeGrants
    .map(
      (grant: any) =>
        `Grantee: ${grant.grantee}, Permission: ${grant.permission}, Expiration: ${grant.expiration}`
    )
    .join("\n");

  return `
    ### DSA Grants Overview:
    Below is the summary of the current grants:

    ### Granter Grants:
    ${granterGrantsText}

    ### Grantee Grants:
    ${granteeGrantsText}

    Please note:
    - The granter assigns permissions to the grantee, such as "Withdraw Delegator Reward", "Vote", or "Send Tokens".
    - The grantee, in turn, receives permissions like "Delegate" or "Vote" that are set to expire on specific dates.
    - If the granter and grantee records are not found, notify the user to create grants or seek permission from others then ask them to click persist grants on the grant dashboard.
    - If the first message is not about grants but greeting like "hi" or "hello", then respond with a greeting and ask them to ask about grants.

    Respond to any user questions based on this data, and clarify specific permissions or expiration dates only when asked.
  `;
};

// API Route to handle user messages
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { message } = req.body;

    // Create context with database content
    const context = await createContext();

    // Add context to the chat history
    const messages = [
      {
        role: "system",
        content: `
          You are a helpful assistant for delegated staking. Use the following context for accurate responses:
          ${context}
        `,
      },
      { role: "user", content: message },
    ];

    try {
      // Get response from SecretAI with context
      const response = await secretAI.chat(messages);
      const aiMessage = response.message.content;

      // Log the raw AI response to check its structure
      console.log("Raw SecretAI Response:", aiMessage);

      // Clean up the AI's response
      const cleanedContent = aiMessage
        // Remove <think> tags
        .replace(/<think>.*?<\/think>/gs, "")
        // Remove markdown headers (##, ###)
        .replace(/^###*\s*/gm, "")
        .replace(/^##*\s*/gm, "")
        // Remove --- (horizontal lines)
        .replace(/^---+\s*/gm, "")
        // Remove bold text (wrapped in **)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        // Replace numbered lists (1., 2., 3.) with new line and numbered points
        .replace(
          /^\d+\.\s*/gm,
          (match: string, offset: number, string: string) => {
            return `\n${match}`;
          }
        )
        // Replace bullet points (•) with new line and bullet points
        .replace(/^•\s*/gm, (match: string, offset: number, string: string) => {
          return `\n${match}`;
        })
        // Remove extra newlines between points
        .replace(/\n\s*\n/g, "\n") // Remove any extra blank lines
        .trim(); // Final trim to remove leading/trailing spaces

      // Log the cleaned content to verify the cleanup process
      console.log("Cleaned SecretAI Response:", cleanedContent);

      // Respond back to the frontend with AI's cleaned response
      res.status(200).json({ content: cleanedContent });
    } catch (error) {
      // Log the error if any
      console.error("Error from SecretAI:", error);
      res.status(500).json({ error: "Error processing the message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
