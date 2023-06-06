// const userDB = {
//   users: require("../models/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const fsPromises = require("fs").promises;
// const path = require("path");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    res.status(400).json({ message: "User or password not provided." });
    return;
  }
  // const foundUser = userDB.users.find((person) => person.username === user);
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // unauthorized

  //evaluate password
  const match = bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create JWTs
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
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // const otherUsers = userDB.users.filter(
    //   (person) => person.username !== foundUser.username
    // );
    // const currentUser = { ...foundUser, refreshToken };
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "models", "users.json"),
    //   JSON.stringify(userDB.users)
    // );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true, // for https, uncomment in prod.
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
