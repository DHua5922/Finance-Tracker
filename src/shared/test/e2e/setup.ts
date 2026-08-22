export default async function globalSetup() {
  process.env.AUTH_API_BACKEND_BASE_URL ??= "http://localhost:8080";
}
