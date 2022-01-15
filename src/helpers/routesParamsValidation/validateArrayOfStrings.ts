export const validateArrayOfStrings = (values: string[]): Promise<void> => {
    const invalidFormatItem = values.findIndex((item) => typeof item !== 'string');
    if (invalidFormatItem !== -1) {
        const error = new Error(`Item arr[${invalidFormatItem}] must be a string`);
        return Promise.reject(error);
    }
    const invalidLengthItem = values.findIndex((item) => !item.length || item.length > 255);
    if (invalidLengthItem !== -1) {
        const error = new Error(`Ivalid length of of item arr[${invalidLengthItem}]`);
        return Promise.reject(error);
    }
    return Promise.resolve();
};
