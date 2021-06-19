const express = require("express")
const router = express.Router()
const multer = require("multer")

const songController = require('./../controllers/songController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const uploadAudio = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("audio")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

const uploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("image")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

router.get("/", songController.getAllSongs)
router.get("/new", songController.getNewSongs)
router.get("/popular", songController.getPopularSongs)
router.get("/:id", songController.getSongById)
router.get("/user/:id", songController.getSongsByUserId)
router.get("/:username/:slug", songController.getSongByUsernameAndSlug)
router.post("/", songController.createSong)
router.put("/:id", songController.updateSong)
router.put("/:id/add-comment", songController.addComment)
router.put("/:id/remove-comment/:commentId", songController.removeComment)
router.put("/:id/toggle-like/:likeUserId", songController.toggleLike)
router.put("/:id/comments/:commentId/toggle-like/:likeUserId", songController.toggleCommentLike)
router.put("/:id/change-file", uploadAudio.single("file"), songController.updateSongFile)
router.put("/:id/change-cover", uploadImage.single("cover"), songController.updateSongCover)
router.put("/:id/add-play", songController.addPlay)
router.delete("/:id", songController.deleteSong)

module.exports = router