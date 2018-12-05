"use strict";
exports.__esModule = true;
function validateLink(link) {
    if (typeof link === "object" &&
        !!link.name &&
        typeof link.name === "string" &&
        !!link.link &&
        typeof link.link === "string") {
        return link;
    }
    return null;
}
exports.validateLink = validateLink;
function validateUser(user, id) {
    if (id === void 0) { id = true; }
    if (typeof user === "object" &&
        (id ? !!user.id && typeof user.id === "string" : true) &&
        !!user.fullName &&
        typeof user.fullName === "string" &&
        !!user.links &&
        Array.isArray(user.links) &&
        user.links.every(function (link) { return !!validateLink(link); })) {
        return user;
    }
    return null;
}
exports.validateUser = validateUser;
