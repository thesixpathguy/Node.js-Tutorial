// const userDB = {
//   users: require("../models/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const fsPromises = require("fs").promises;
// const path = require("path");

const User = require("../models/User");

const handleLogout = async (req, res) => {
  // On client, also delete the access token.

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }
  const refreshToken = cookies.jwt;

  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  } // unauthorized

  // delete refresh token in db
  // const otherUsers = userDB.users.filter(
  //   (person) => person.refreshToken !== refreshToken
  // );
  // delete foundUser["refreshToken"];
  // userDB.setUsers([...otherUsers, foundUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "models", "users.json"),
  //   JSON.stringify(userDB.users)
  // );

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  return res.sendStatus(204);
};

module.exports = { handleLogout };
