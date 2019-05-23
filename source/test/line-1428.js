const promise1 = this.getDates({
    entityId,
    orderType,
}).then((dates) => {
    if (dates.data) {
        return dates.data;
    }
    throw new Error(dates.message);
});

const promise2 = this.getDiscounts({
    entityId,
    orderType,
}).then((dates) => {
    if (dates.data) {
        return dates.data;
    }
    throw new Error(dates.message);
});

return Promise.all([promise1, promise2]);
