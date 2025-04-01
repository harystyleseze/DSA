import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Forward the request to the Flask backend
      const response = await axios.post(
        "http://localhost:8000/api/chat",
        req.body
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error communicating with Flask backend:", error);
      res.status(500).json({
        error: "Error processing your request... Please try again later.",
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
