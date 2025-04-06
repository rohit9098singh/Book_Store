import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Request } from "express";
import User, { IUser } from "../../models/User";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: IUser | false) => void
    ): Promise<void> => {
      const { emails, displayName, photos } = profile;
      console.log("this is the profile", profile);

      try {
        let user = await User.findOne({ email: emails?.[0]?.value });

        if (user) {
          if (!user.profilePicture && photos?.[0]?.value) {
            user.profilePicture = photos?.[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          name: displayName,
          email: emails?.[0]?.value,
          profilePicture: photos?.[0]?.value,
          isVerified: true,
          agreeTerms: true,
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
