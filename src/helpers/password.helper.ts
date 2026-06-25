import bcrypt from 'bcrypt';

const passwordHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_ROUNDS), 'a');
    return await bcrypt.hash(password, salt);
};

const passwordCompare = async (input: string, password: string): Promise<boolean> => {
    return await bcrypt.compare(input, password);
};

export {
    passwordHash,
    passwordCompare
};