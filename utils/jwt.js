import "dotenv/config";

export const sendToken = (user, statuscode, res) => {
  const token = user.getJwtToken();

  //  from the developer
  const options = {
    maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    httpOnly: true,
    secure: true, // Set this to true for HTTPS
    sameSite: "none", // Set this based on your requirements
    path: "/", // Set the path as needed
  };
  res.cookie("token", token, options);
  res.status(statuscode).json({
    success: true,
    message: `Welcome ${user.username} `,
    user,
    token,
  });
};
