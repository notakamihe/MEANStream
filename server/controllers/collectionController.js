const Collection = require("./../models/Collection")
const Song = require("./../models/Song")
const User = require("./../models/User")

const { isOIdInDatabase } = require("../utils/utils")
const moment = require("moment")
const { uploadFile } = require("../s3")

const getPopulatedCollection = (collection, res) => {
    collection.populate("songs").populate("user").execPopulate((err, doc) => {
        return res.json(doc)
    })
}

const getPopulatedCollections = (collections, res) => {
    collections.populate("user").populate("songs").exec((err, docs) => {
        return res.json(docs)
    })
}

module.exports.addSong = async (req, res) => {
    if (!(await isOIdInDatabase(Song, req.params.songId)))
        return res.status(400).send(`Song w/ id of ${req.params.songId} does not exist.`)

    Collection.findByIdAndUpdate(req.params.id, {$addToSet: {songs: req.params.songId}}, {new: true}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(400).send(`Could not add song to collection.`)
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

module.exports.createCollection = async (req, res) => {
    if (!(await isOIdInDatabase(User, req.body.user)))
        return res.status(400).send(`User w/ id of ${req.body.user} does not exist.`)

    const collection = new Collection({
        category: req.body.category ? req.body.category.toLowerCase() : "",
        description: req.body.description,
        private: Boolean(req.body.private),
        title: req.body.title,
        user: req.body.user,
        releaseDate: req.body.releaseDate
    })

    try {
        const result = await collection.save()
        getPopulatedCollection(result, res)
    } catch (err) {
        if (err.errors) {
            return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message)
        }

        console.log(err);
        return res.status(500).send("Could not create collection.")
    }
}

module.exports.deleteCollection = async (req, res) => {
    Collection.findByIdAndDelete(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not delete collection.")
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        return res.send("Collection deleted.")
    })
}

module.exports.getAllCollections = async (req, res) => {
    return getPopulatedCollections(Collection.find(), res)
}

module.exports.getCollectionById = async (req, res) => {
    Collection.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get collection.")
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

module.exports.getCollectionsByUserId = async (req, res) => {
    if (!(await isOIdInDatabase(User, req.params.id)))
        return res.status(400).send(`User w/ id of ${req.params.id} does not exist.`)

    return getPopulatedCollections(Collection.find({user: req.params.id}), res)
}

module.exports.getCollectionsBySongId = async (req, res) => {
    if (!(await isOIdInDatabase(Song, req.params.id)))
        return res.status(400).send(`Song w/ id of ${req.params.id} does not exist.`)

    return getPopulatedCollections(Collection.find({songs: req.params.id}), res)
}

module.exports.getCollectionByUsernameAndSlug = async (req, res) => {
    User.findOne({username: req.params.username}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not get collection by username and slug.")
        }

        if (!doc)
            return res.status(400).send(`User w/ username of ${req.params.username} does not exist.`)

        Collection.findOne({slug: req.params.slug, user: doc._id}, (e, d) => {
            if (!d)
                return res.status(400).send(`Collection w/ slug of ${req.params.slug} by ${req.params.username} does not exist.`)
            
            getPopulatedCollection(d, res)
        })
    })
}

module.exports.removeSong = async (req, res) => {
    if (!(await isOIdInDatabase(Song, req.params.songId)))
        return res.status(400).send(`Song w/ id of ${req.params.songId} does not exist.`)

    Collection.findByIdAndUpdate(req.params.id, {$pull: {songs: req.params.songId}}, {new: true}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(400).send(`Could not add song to collection.`)
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

module.exports.updateCollection = async (req, res) => {
    Collection.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        private: Boolean(req.body.private),
        category: req.body.category ? req.body.category.toLowerCase() : "",
        releaseDate: req.body.releaseDate || moment(new Date).format("YYYY-MM-DD")
    }, {new: true, runValidators: true}, (err, doc) => {
        if (err) {
            if (err.errors) {
                return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
            }

            console.log(err);
            return res.status(400).send(`Could not update collection.`)
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

module.exports.updateCollectionCover = async (req, res) => {
    const cover = req.file

    if (cover) {
      await uploadFile(cover)
    }

    Collection.findByIdAndUpdate(req.params.id, {coverUrl: cover?.path}, {new: true}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not update collection.")
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

module.exports.updateSongs = async (req, res) => {
    if (req.body.songs) {
        for (const song of req.body.songs) {
            if (!(await isOIdInDatabase(Song, song)))
                return res.status(400).send(`Songs array does not contain valid OID(s).`)

            if (req.body.songs.filter(s => s == song).length >= 2)
                return res.status(400).send(`Songs array must not contain duplicate songs.`)
        }
    }

    Collection.findByIdAndUpdate(req.params.id, {songs: req.body.songs || []}, {new: true}, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Could not update collection.")
        }

        if (!doc)
            return res.status(400).send(`Collection w/ id of ${req.params.id} does not exist.`)

        getPopulatedCollection(doc, res)
    })
}

