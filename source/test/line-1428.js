const promise1 = new Promise(async (resolve, reject) => {
    const dates = await this.getDates({
        entityId,
        orderType,
    });
    if (dates.data) {
        resolve(dates.data);
    } else {
        reject(dates.message);
    }
});
const promise2 = new Promise(async (resolve, reject) => {
    const dates = await this.getDiscounts({
        entityId,
        orderType,
    });
    if (dates.data) {
        resolve(dates.data);
    } else {
        reject(dates.message);
    }
});

return Promise.all([promise1, promise2]);
