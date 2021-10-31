const express = require("express")
const router = express.Router()

const controller = require("./../controllers/commentController")

router.get("/", controller.getAllComments)
router.get("/user/:id", controller.getCommentsByUser)
router.get("/:id", controller.getCommentById)
router.get("/:id/replies", controller.getCommentReplies)
router.get("/:id/song", controller.getCommentSong)
router.delete("/:id", controller.deleteComment)

module.exports = router