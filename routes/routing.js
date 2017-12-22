const express = require('express');
const router = express.Router();

let services = {};

router.post("/", addService);
router.get("/", listServices);
router.get("/:serviceName", getService);

function addService(request, response) {
    services[request.body.name] = request.body.url;
    response.json(true);
}

function listServices(request, response) {
    response.json(services);
}

function getService(request, response) {
    response.json(services[request.params.serviceName]);
}

module.exports = router;