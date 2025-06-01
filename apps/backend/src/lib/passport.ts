import passport from "passport";
import { Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import UserModel from "@shared/models/user.model";
import { Request } from "express";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

const opts: StrategyOptions = {
  jwtFromRequest: (req: Request) => {
    return req?.cookies?.token || null;
  },
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await UserModel.findById(jwtPayload.sub).select("-password");
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
