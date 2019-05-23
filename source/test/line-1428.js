``` js
const getDateList = async (resolve, reject) => {
    const dates = await this.getDates({
        entityId,
        orderType,
    });
    if (dates.data) {
        resolve(dates.data);
    } else {
        reject(dates.message);
    }
};
const getDiscountList = async (resolve, reject) => {
    const dates = await this.getDiscounts({
        entityId,
        orderType,
    });
    if (dates.data) {
        resolve(dates.data);
    } else {
        reject(dates.message);
    }
};
const promise1 = new Promise(((resolve, reject) => {
    getDateList(resolve, reject);
}));
const promise2 = new Promise(((resolve, reject) => {
    getDiscountList(resolve, reject);
}));

return Promise.all([promise1, promise2]);
```
