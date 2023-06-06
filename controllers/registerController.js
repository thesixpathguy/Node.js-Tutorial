// const userDB = {
//   users: require("../models/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../models/User");

// const fsPromises = require("fs").promises;
// const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    res.status(400).json({ message: "User or password not provided." });
    return;
  }
  // check for duplicate usernames in database
  // const duplicate = userDB.users.find((person) => person.username === user);
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) {
    res.sendStatus(409);
    return;
  }
  try {
    const hashedPass = await bcrypt.hash(password, 10);

    // const newUser = {
    //   username: user,
    //   roles: { User: 2001 },
    //   password: hashedPass,
    // };

    const result = await User.create({
      username: user,
      password: hashedPass,
    });
    console.log(result);

    // userDB.setUsers([...userDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "models", "users.json"),
    //   JSON.stringify(userDB.users)
    // );
    // console.log(userDB.users);

    res.status(201).json({ message: `New User: ${user} created.` });
  } catch (err) {
    res.status(500).json({ message: `${err.message}` });
  }
};

module.exports = { handleNewUser };
