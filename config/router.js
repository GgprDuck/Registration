const express = require('express');
const router = express.Router();
const control = require('../components/user/controller');
const middleware = require('./middleware');

router.use(middleware.BodyParser);
router.use(middleware.CookieParser);
router.use(middleware.Compression);
router.use(middleware.Helmet);
router.use(middleware.Cors);
router.use(middleware.Refresh);

router.get("/", control.getAll);

router.post("/sign-up",control.postCont);

router.post("/sign-in",control.signIn);

router.patch("/", control.patch);

router.delete("/", control.deleteUser);

module.exports = router;