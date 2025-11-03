// src/mastra/shared/config/database.ts
import type { MastraStorage } from "@mastra/core/storage";
import type { MastraVector } from "@mastra/core/vector";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

/**
 * Detects if the application is running in a cloud deployment environment
 */
export function isCloudDeployment(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.RAILWAY ||
    process.env.MASTRA_CLOUD ||
    process.env.NODE_ENV === "production" ||
    process.env.MASTRA_DEPLOYMENT
  );
}

/**
 * Creates a database configuration that automatically uses memory storage
 * in cloud environments and file-based storage in local development
 */
export function createDatabaseConfig(dbName = "mastra.db"): MastraStorage {
  if (isCloudDeployment()) {
    console.log(`🔧 [${dbName}] Using in-memory storage for cloud deployment`);
    return new LibSQLStore({
      url: ":memory:",
    }) as unknown as MastraStorage;
  }

  // For local development, use file-based storage
  console.log(`🔧 [${dbName}] Using file-based storage for local development`);
  return new LibSQLStore({
    url: `file:./${dbName}`,
  }) as unknown as MastraStorage;
}

/**
 * Creates a vector database configuration that automatically uses memory storage
 * in cloud environments and file-based storage in local development
 */
export function createVectorConfig(dbName = "mastra.db"): MastraVector {
  if (isCloudDeployment()) {
    console.log(
      `🔧 [${dbName}] Using in-memory vector storage for cloud deployment`
    );
    return new LibSQLVector({
      connectionUrl: ":memory:",
    }) as unknown as MastraVector;
  }

  // For local development, use file-based storage
  console.log(
    `🔧 [${dbName}] Using file-based vector storage for local development`
  );
  return new LibSQLVector({
    connectionUrl: `file:./${dbName}`,
  }) as unknown as MastraVector;
}

