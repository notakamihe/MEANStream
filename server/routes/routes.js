const express = require("express")
const router = express.Router()

const userRoutes = require("./userRoutes")
const songRoutes = require("./songRoutes")
const collectionRoutes = require("./collectionRoutes")
const commentRoutes = require("./commentRoutes")

router.use("/users", userRoutes)
router.use("/songs", songRoutes)
router.use("/collections", collectionRoutes)
router.use("/comments", commentRoutes)

module.exports = router