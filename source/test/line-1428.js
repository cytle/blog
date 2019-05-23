const promise1 = (async function(resolve, reject) {
    const dates = await this.getDates({
        entityId,
        orderType,
    });
    if (dates.data) {
        return dates.data;
    }
    throw new Error(dates.message);
}());
const promise2 = (async function(resolve, reject) {
    const dates = await this.getDiscounts({
        entityId,
        orderType,
    });
    if (dates.data) {
        return dates.data;
    }
    throw new Error(dates.message);
}());

return Promise.all([promise1, promise2]);
