const express = require('express');
const router = express.Router();

router.post("/", authenticate);

function authenticate(request, response) {
    // High security :o)
    if (request.body.password === "password") {
        response.json({
            username: request.body.username,
            until: Date.now() + 60000   // 60,000ms == 60sec == 1min
        });
    } else {
        response.json(false);
    }
}

function checkAuthentication(token) {
    // Wenn token-Zeit noch nicht abgelaufen, dann true, sonst false
    return (token.until >= Date.now());
}

module.exports = {
    router: router,
    checkAuth: checkAuthentication
};
