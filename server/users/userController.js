var jwt = require('jwt-simple');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var helpers = require('./../db/helpers.js');
var utils = require('./../utility/utility.js');

module.exports = {
  signup: function(req, res) {
    var newUser = req.body.userData;
    
    bcrypt.genSalt(10, function(error, salt) {
      if(error) {
        return res.status(401).send(error)
      }
      bcrypt.hash(newUser.password, null, null, function(error, hash) {
        if(error) {
          throw error;
        }
        newUser.password = hash;
        helpers.addUser(newUser)
          .then(function(newUser) {
            return res.status(200).json({user: newUser, token: utils.issueToken({username: newUser.get('username')})});
        })
        .catch(function(error) {
          return res.status(401).send(error);
        })
      });
    });
  },


  login: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if(!username || !password) {
      return res.status(401).send('Please enter your username and your password.');
    }

    helpers.getUser(user)
      .then(function(resUser) {
        console.log("USER INFORMATION", resUser.get('username'));
          bcrypt.compare(password, resUser.password, function(error, isMatch) {
            if(isMatch) {
              return res.status(200).json({ user: resUser, token: utils.issueToken({username:resUser.get('username')})});
            }
            if(error) {
              return res.status(401).send(error);
            }
          });
        })
      .catch(function(error) {
        return res.status(401).send(error);
      })
  }
};






