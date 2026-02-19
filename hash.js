const bcrypt = require("bcrypt");

bcrypt.hash("StrongPassword123!", 10).then(hash => {
  console.log(hash);
});