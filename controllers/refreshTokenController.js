// const userDB = {
//   users: require("../models/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
    return;
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403); // unauthorized

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3m" }
    );
    res.json({ accessToken: accessToken });
  });
};

module.exports = { handleRefreshToken };
