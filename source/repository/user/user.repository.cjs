const { userRepositoryGetByEmail } = require("./user.repository.getbyemail.cjs");
const { userRepositoryPost } = require("./user.repository.post.cjs");

module.exports.userRepository = {
    post: userRepositoryPost,
    getByEmail: userRepositoryGetByEmail
};