export const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60 * 1000; // Convert minutes to milliseconds

    return new Date(date.getTime() + offset);
}