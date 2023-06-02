const bcrypt = require("bcryptjs");
const usersCollection = require("../db").collection("users");

let User = function(data) {
  this.data = data;
  this.errors = [];
  this.errorsProfile = [];
};

User.prototype.cleanUp = function() {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    password: this.data.password
  };
};

User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.data.username })
      .then(attemptedUser => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          this.data = attemptedUser;
          resolve("Successfully logged in.");
        } else {
          reject("Username / password are invalid.");
        }
      })
      .catch(function() {
        reject("Please try again later.");
      });
  });
};

User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      usersCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Please try again later.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

module.exports = User;