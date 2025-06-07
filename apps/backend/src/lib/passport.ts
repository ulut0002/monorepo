import passport from "passport";
import { Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { Request } from "express";
import { UserModel } from "@monorepo/shared";

// Load the JWT secret key from environment variables.
// Defaults to a hardcoded fallback in dev, but should be set in .env for production.
const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

// Configuration options for the JWT strategy.
// Instead of reading the token from Authorization header, we extract it from the 'token' cookie.
const opts: StrategyOptions = {
  jwtFromRequest: (req: Request) => {
    return req?.cookies?.token || null; // Expect token to be stored in a secure, HttpOnly cookie
  },
  secretOrKey: jwtSecret,
};

// Register the JWT strategy with Passport.js.
// This strategy will be used to authenticate protected routes by validating the token.
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // Look up the user using the ID encoded in the token (`sub` stands for subject).
      const user = await UserModel.findById(jwtPayload.sub).select("-password");

      if (!user) {
        // User not found — authentication fails
        return done(null, false);
      }

      // User found — pass it to Passport, which sets req.user
      return done(null, user);
    } catch (error) {
      // In case of DB errors or other unexpected issues
      return done(error, false);
    }
  })
);

// Export configured Passport instance to be used in your Express app
export default passport;
