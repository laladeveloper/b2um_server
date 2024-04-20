import express from "express";
import { connectDB } from "./utils/features.js";
import userRoute from "./routes/user.js";
import passport from "passport";
import cors from "cors";
import User from "./models/user.js";
import session from "express-session";
import { Strategy } from "passport-local";
// import LocalStrategy from "passport-local"
const app = express();
connectDB();

app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors()); // Enable CORS for all origins

// use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()))/'K;
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
app.use("/user", userRoute);
app.get("/success",(req,res)=>{
  res.send(`success`)
})
app.get("/fail",(req,res)=>{
  res.send(`fail`)
})
app.post("/user/loginn",passport.authenticate("local",{successRedirect:"/success",failureRedirect:"/fail"}))
// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );
passport.use(
  new Strategy(async function verify(email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
        // return done("Invalid email or password")
        // res
        //   .status(401)
        //   .json({ success: false, message: "Invalid email or password" });
      }
      // Verify the password using the user's method
      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid.user) {
        return done(null, false);
        //  res
        //   .status(401)
        //   .json({ success: false, message: "Invalid  email or  password" });
      }

      // Password is valid, return success response
      return done(null, user);
      // res
      //   .status(200)
      //   .json({
      //     success: true,
      //     user,
      //     message: `Welcome ${user.username} from B2UM`,
      //   });
    } catch (err) {
      console.error(err);
      return done(err);
      // res
      //   .status(500)
      //   .json({ success: false, message: "Internal server error" });
    }
  })
);

// passport.serializeUser((user,done)=>{
//   done(null,user.id)
// })
// passport.deserializeUser(async (id,done)=>{
//  try {
  
//    const user = await User.findOne(id)
  
//    done(null,user)
//   } catch (error) {
    
//     done(error,false)
//  }
// })

const port = 4000;
app.listen(port, function listening(req, res) {
  console.log(`Server is running of port ${port}`);
});
