const bcrypt = require('bcrypt');

const hash = async (password) => {
    const salt = await bcrypt.genSalt(Number(process.env.ROUNDS), 'a');
    return await bcrypt.hash(password, salt);
};

const compare = async (input, password) => {
    return await bcrypt.compare(input, password);
};

module.exports = {
    hash,
    compare
};