
function getDaysBetweenDates(from_date, to_date) {
    const startDate = new Date(from_date);
    const endDate = new Date(to_date);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days (1 day = 86,400,000 milliseconds)
    return Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))+1;
}