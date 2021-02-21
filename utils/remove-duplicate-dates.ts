const removeDuplicateDates = (dates: Date[]) => {
    let timestamps: number[] = [];

    dates.forEach(date => {
        timestamps.push(date.getTime());
    });

    timestamps = [...new Set(timestamps)];

    return timestamps.map(timestamp => new Date(timestamp));
};

export default removeDuplicateDates;
