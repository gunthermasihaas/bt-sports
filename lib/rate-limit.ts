import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "bt-sports:contact",
});

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "bt-sports:login",
});

export const loginIpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "15 m"),
  prefix: "bt-sports:login-ip",
});
