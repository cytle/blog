return Promise.all([
    this.getDates({ entityId, orderType })
        .then(({ message, data }) => data || Promise.reject(new Error(message))),
    this.getDiscounts({ entityId, orderType })
        .then(({ message, data }) => data || Promise.reject(new Error(message))),
]);
