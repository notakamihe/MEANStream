const express = require("express")
const router = express.Router()
const multer = require("multer")

const userController = require("../controllers/userController")


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

router.get("/", userController.getAllUsers)
router.get("/user", userController.getUserByToken)
router.get("/:id", userController.getUserById)
router.get("/:id/liked", userController.getLiked)
router.get("/username/:username", userController.getUserByUsername)
router.post("/register", userController.registerUser)
router.post("/login", userController.authenticateUser)
router.put("/:id", userController.updateUser)
router.put("/:id/private-all", userController.privateAll)
router.put("/:id/remove-all-likes-comments", userController.removeAllLikesComments)
router.put("/:id/change-pfp", upload.single("pfp"), userController.updateUserPfp)
router.put("/:id/change-password", userController.updateUserPassword)
router.put("/:id/add-follower/:followerId", userController.addFollower)
router.put("/:id/add-following/:followingId", userController.addFollowing)
router.put("/:id/remove-follower/:followerId", userController.removeFollower)
router.put("/:id/remove-following/:followingId", userController.removeFollowing)
router.delete("/:id", userController.deleteUser)

module.exports = router