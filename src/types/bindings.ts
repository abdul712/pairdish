export type Bindings = {
  DB: D1Database
  DOMAIN: string
  CACHE: KVNamespace
  ASSETS: Fetcher
  ADMIN_API_KEY: string
  ENVIRONMENT?: string
}