interface Env {
  // D1 Database
  DB: D1Database;
  
  // KV Namespace for caching
  CACHE: KVNamespace;
  
  // Environment variables
  DOMAIN: string;
  API_KEY?: string;
}