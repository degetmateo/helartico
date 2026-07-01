import { randomBytes } from "node:crypto";

const generateExchangeCode = (length: number = 8): string => {
    const characters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code: string = '';
    const bytes = randomBytes(length);

    for (let i = 0; i < length; i++) {
        code += characters[bytes[i] % characters.length];
    };

    return code;
};

const codesHelper = {
    generateExchangeCode
};

export default codesHelper;