import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
/**
 * Detects if the application is running in a cloud deployment environment
 */
export function isCloudDeployment() {
    return !!(process.env.VERCEL ||
        process.env.NETLIFY ||
        process.env.RAILWAY ||
        process.env.MASTRA_CLOUD ||
        process.env.NODE_ENV === "production" ||
        process.env.MASTRA_DEPLOYMENT);
}
/**
 * Creates a database configuration that automatically uses memory storage
 * in cloud environments and file-based storage in local development
 */
export function createDatabaseConfig(dbName = "mastra.db") {
    if (isCloudDeployment()) {
        console.log(`🔧 [${dbName}] Using in-memory storage for cloud deployment`);
        return new LibSQLStore({
            url: ":memory:",
        });
    }
    // For local development, use file-based storage
    console.log(`🔧 [${dbName}] Using file-based storage for local development`);
    return new LibSQLStore({
        url: `file:./${dbName}`,
    });
}
/**
 * Creates a vector database configuration that automatically uses memory storage
 * in cloud environments and file-based storage in local development
 */
export function createVectorConfig(dbName = "mastra.db") {
    if (isCloudDeployment()) {
        console.log(`🔧 [${dbName}] Using in-memory vector storage for cloud deployment`);
        return new LibSQLVector({
            connectionUrl: ":memory:",
        });
    }
    // For local development, use file-based storage
    console.log(`🔧 [${dbName}] Using file-based vector storage for local development`);
    return new LibSQLVector({
        connectionUrl: `file:./${dbName}`,
    });
}
