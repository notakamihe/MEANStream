const express = require("express")
const router = express.Router()
const multer = require("multer")

const collectionController = require("./../controllers/collectionController")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("image")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

router.get("/", collectionController.getAllCollections)
router.get("/:id", collectionController.getCollectionById)
router.get("/user/:id", collectionController.getCollectionsByUserId)
router.get("/song/:id", collectionController.getCollectionsBySongId)
router.get("/:username/:slug", collectionController.getCollectionByUsernameAndSlug)
router.post("/", collectionController.createCollection)
router.put("/:id", collectionController.updateCollection)
router.put("/:id/change-cover", upload.single("cover"), collectionController.updateCollectionCover)
router.put("/:id/add-song/:songId", collectionController.addSong)
router.put("/:id/remove-song/:songId", collectionController.removeSong)
router.put("/:id/songs", collectionController.updateSongs)
router.delete("/:id", collectionController.deleteCollection)

module.exports = router