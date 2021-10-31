module.exports.isOIdInDatabase = async (model, id) => {
    try {
        const result = await model.findById(id)

        if (!result)
            return false

        return true
    } catch (err) {
        return false
    }
}
