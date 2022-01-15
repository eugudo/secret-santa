export const getPortNumberFromEnv = (): number => {
    const port = process.argv.slice(2)[0];
    return /\d{4,}/gm.test(port) ? Number(port) : 5000;
};
