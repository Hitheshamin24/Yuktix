const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/auth.controller");
const authMiddleware=require("../middlewares/auth.middleware")


/**
 * @route POST /api/auth/register
 * @description register a new user
 */

authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login  a  user with email and password
 * @access public
 */

authRouter.post("/login", authController.loginUserController);
/**
 * @route get /api/auth/logout
 * @description clear toke from user cookie and add token in the blacklist
 *  @access public
 */


authRouter.get("/logout",authController.logoutUserController)


/**
 * @route GET/api/auth/get-me
 * @description get the current logged in details
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports = authRouter;
