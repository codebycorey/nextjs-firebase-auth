import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../lib/firebase-admin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await auth.verifyIdToken(req.headers.token as string);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};
