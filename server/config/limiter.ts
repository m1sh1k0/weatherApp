import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express";

class Limiter {
  rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: 86400
  });

  limitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = "";
    // Consume 1 point for each action
    this.rateLimiter
      .consume(userId)
      .then(() => {
        next();
      })
      .catch(rejRes => {
        res.status(429).send("You can do only 50 calls per 24 hours");
      });
  };
}

export default new Limiter();
