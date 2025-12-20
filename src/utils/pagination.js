const paginate = async (query, {page = 1, limit = 10} = {}) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        query.model.countDocuments(query.getFilter())
    ]);
    const pages = Math.max(1, Math.ceil(total / limit));
    return {data, total, page, pages};
};

module.exports = { paginate };