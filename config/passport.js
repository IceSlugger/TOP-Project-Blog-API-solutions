const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const userId = Number(
        jwt_payload.id ?? 
        jwt_payload.userId ?? 
        jwt_payload.sub ?? 
        (typeof jwt_payload === 'number' || typeof jwt_payload === 'string' ? jwt_payload : null)
      );

      if (!userId || isNaN(userId)) {
        return done(null, false);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);