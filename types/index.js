"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNode(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('tagtask'))
        return false;
    if (typeof arg.tagtask !== 'string')
        return false;
    return true;
}
exports.isNode = isNode;
function isLink(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('source'))
        return false;
    if (typeof arg.source !== 'number')
        return false;
    if (!arg.hasOwnProperty('target'))
        return false;
    if (typeof arg.target !== 'number')
        return false;
    if (!arg.hasOwnProperty('slotName'))
        return false;
    if (typeof arg.slotName !== 'string')
        return false;
    return true;
}
exports.isLink = isLink;
function isTopology(arg) {
    if (!arg)
        return false;
    // nodes
    if (!arg.hasOwnProperty('nodes'))
        return false;
    if (!Array.isArray(arg.nodes))
        return false;
    for (let n of arg.nodes) {
        if (!isNode(n))
            return false;
    }
    // links
    if (!arg.hasOwnProperty('links'))
        return false;
    if (!Array.isArray(arg.links))
        return false;
    for (let l of arg.links) {
        if (!isLink(l))
            return false;
    }
    return true;
}
exports.isTopology = isTopology;
function isSlotRef(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('taskIndex'))
        return false;
    if (typeof arg.taskIndex !== 'number')
        return false;
    if (!arg.hasOwnProperty('slotName'))
        return false;
    if (typeof arg.slotName !== 'string')
        return false;
    return true;
}
exports.isSlotRef = isSlotRef;
