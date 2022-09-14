module.exports = {
    hashPwd: ( password ) => {
      const saltRounds = 10;
      return bcrypt.hashSync(password, saltRounds);
    },
    comparePwd: ( password, hash ) => {
      return bcrypt.compareSync(password, hash);
    }
};