import { NextApiRequest, NextApiResponse } from "next";
import {
  addGranterGrant,
  getGranterGrants,
  addGranteeGrant,
  getGranteeGrants,
} from "../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // Fetch all granter and grantee grants
      const granterGrants = await getGranterGrants();
      const granteeGrants = await getGranteeGrants();
      return res.status(200).json({ granterGrants, granteeGrants });
    }

    if (req.method === "POST") {
      const { granterGrants, granteeGrants } = req.body;

      // Check if the required fields are present in the request body
      if (!Array.isArray(granterGrants) || !Array.isArray(granteeGrants)) {
        console.error(
          "Invalid data structure: Expected arrays for granterGrants and granteeGrants."
        );
        return res
          .status(400)
          .json({
            message:
              "Invalid data structure. Expected arrays for granterGrants and granteeGrants.",
          });
      }

      // Add new granter and grantee grants
      try {
        // Persist Granter Grants
        for (const grant of granterGrants) {
          if (!grant.granter || !grant.permission || !grant.expiration) {
            console.error("Missing required fields in granter grant:", grant);
            return res
              .status(400)
              .json({ message: "Missing required fields in granter grant." });
          }
          await addGranterGrant(grant);
        }

        // Persist Grantee Grants
        for (const grant of granteeGrants) {
          if (!grant.grantee || !grant.permission || !grant.expiration) {
            console.error("Missing required fields in grantee grant:", grant);
            return res
              .status(400)
              .json({ message: "Missing required fields in grantee grant." });
          }
          await addGranteeGrant(grant);
        }

        return res.status(201).json({ message: "Grants added successfully" });
      } catch (error) {
        console.error("Error persisting grants:", error);
        return res.status(500).json({ message: "Failed to persist grants" });
      }
    }

    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
