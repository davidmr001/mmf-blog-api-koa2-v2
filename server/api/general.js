/**
 * 通用列表
 * @method list
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.list = async (ctx, mongoDB) => {
    var limit = ctx.query.limit,
        page = ctx.query.page
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    if (!page) page = 1
    if (!limit) limit = 10
    var skip = (page - 1) * limit
    try {
        const [list, total] = await Promise.all([
            mongoDB.find().sort('-_id').skip(skip).limit(limit).exec(),
            mongoDB.countAsync()
        ])
        var totalPage = Math.ceil(total / limit)
        ctx.success({
            list,
            total,
            hasNext: totalPage > page ? 1 : 0,
            hasPrev: page > 1 ? 1 : 0
        })
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * 通用单个
 * @method item
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.item = async (ctx, mongoDB) => {
    var id = ctx.query.id
    if (!id) {
        ctx.error('参数错误')
        return
    }
    try {
        const result = await mongoDB.findOneAsync({ _id: id })
        ctx.success(result)
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * 通用删除
 * @method deletes
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.deletes = async (ctx, mongoDB) => {
    var id = ctx.query.id
    try {
        await mongoDB.updateAsync({ _id: id }, { is_delete: 1 })
        ctx.success('success', '更新成功')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * 通用编辑
 * @method modify
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @param  {[type]} id      [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
exports.modify = async (ctx, mongoDB, id, data) => {
    try {
        const result = await mongoDB.findOneAndUpdateAsync({ _id: id }, data, { new: true })
        ctx.success(result, '更新成功')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * 通用编辑
 * @method recover
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.recover = async (ctx, mongoDB) => {
    var id = ctx.query.id
    try {
        await mongoDB.updateAsync({ _id: id }, { is_delete: 0 })
        ctx.success('success', '更新成功')
    } catch (err) {
        ctx.error(err.toString())
    }
}
