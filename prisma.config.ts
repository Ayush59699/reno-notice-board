import "dotenv/config";
import { defineConfig } from "prisma/config";

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  
  let cleanUrl = url.replace(/^\"|\"$/g, '');
  if (cleanUrl.startsWith('mysql://') && !cleanUrl.includes('sslaccept=')) {
    const separator = cleanUrl.includes('?') ? '&' : '?';
    cleanUrl = `${cleanUrl}${separator}sslaccept=strict`;
  }
  return cleanUrl;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
