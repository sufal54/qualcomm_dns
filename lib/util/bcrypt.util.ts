import * as bcrypt from "bcrypt";

export const compare = async (key1, key2) => {
    return await bcrypt.compare(key1, key2);
}