import "dotenv/config";
import { z } from "zod";

export default async function globalSetup() {
  process.env.AUTH_API_BACKEND_BASE_URL = z
    .url()
    .parse(process.env.AUTH_API_BACKEND_BASE_URL);
}
