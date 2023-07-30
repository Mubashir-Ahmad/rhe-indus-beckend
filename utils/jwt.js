import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const sendtoken = (user, statusCode, res) => {
  console.log('Before calling getJWTtoken');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  console.log('tokeen', token);

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, // Make sure to use secure: true in production (HTTPS)
    path: '/', // Adjust the path based on your needs
  };

  // Serialize the cookie
  const serializedCookie = cookie.serialize('token', token, options);

  // Set the cookie in the response header
  res.setHeader('Set-Cookie', serializedCookie);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export default sendtoken;
