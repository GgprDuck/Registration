const jwt = require("jsonwebtoken")
const User = require('./model');
const Joi = require('joi');

const schema = Joi.object({
    login: Joi.string(),
    password: Joi.string(),
    Access_tocken: "",
    Refresh_tocken:"",
});

const jwtExpirySeconds = 300;
const jwtKey = "my_secret_key";

async function clientErrorHandler(statusErr){
    if(statusErr == 400){
        res.status(404).send("Bad request");
    }
    else if(statusErr == 401){
        res.status(401).send("You unathorized");
    }
    else if(statusErr == 404){
        res.status.send("User not found");
    }
    else if(statusErr == 403){
        res.status.send("Wrong login orr password");
    }
};


async function postCont(req, res, next) {
    try {
        const user = new User({
            login: req.query.login,
            password: req.query.password,
            Access_tocken: "",
            Refresh_tocken:"",
        });
        schema.validate({ user });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        clientErrorHandler(400);
    }
};

async function getAll(req, res, next) {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

async function signIn(req, res, next) {
    try {
        const user = await User.findOne({ login: req.query.login, password: req.query.password });
        if (user) {
            const access_token = jwt.sign({ user }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            })
        user.Access_tocken = access_token;
        const refresh_token = jwt.sign({ user }, jwtKey, {
            algorithm: "HS256",
            expiresIn: 3600,
        })
        user.Refresh_tocken = refresh_token;
            await user.save();
            return res.status(201).send("You successfully authorized");
        }
        res.cookie("Access_token", access_token, { maxAge: jwtExpirySeconds * 1000 });
        res.cookie("Refresh_token", refresh_token, { maxAge: 3600 * 1000 });
        res.status(201).send("You sign up completed");
    } catch (error) {
        clientErrorHandler(401);
    }
};

async function patch(req, res, next) {
    try {
        const user = await User.findOne({ login: req.query.login });
        if (!user) {
            clientErrorHandler(404);
        }
        else {
            user.password = req.query.password;
            await user.save();
            res.status(202).send(user);
        }
    } catch (error) {
        clientErrorHandler(400);
    }
};


async function deleteUser(req, res, next) {
    try {
        const user = await User.findOne({ login: req.query.login });
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            if (user.password === req.query.password) {
                user.login = null;
                user.password = null;
                user.tocken = null;
                res.status(200).send(user);
            }
            else {
                clientErrorHandler(403);
            }
        }
    } catch (error) {
        clientErrorHandler(400);
    }
}


module.exports = { postCont, getAll, signIn, patch, deleteUser };