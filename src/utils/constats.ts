export const ARTICLE_PER_PAGE = 6;

export const PRODUCTION_DOMAIN = "https://cloud-project-taupe.vercel.app";
export const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;
