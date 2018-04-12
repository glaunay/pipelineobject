"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function is_lightInlet(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('uuid'))
        return false;
    if (typeof arg.uuid !== 'string')
        return false;
    return true;
}
exports.is_lightInlet = is_lightInlet;
function is_fullInlet(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('outletNum'))
        return false;
    if (typeof arg.outletNum !== 'number')
        return false;
    if (!arg.hasOwnProperty('tagtask'))
        return false;
    if (typeof arg.tagtask !== 'string')
        return false;
    if (!arg.hasOwnProperty('slot'))
        return false;
    if (typeof arg.slot !== 'string')
        return false;
    if (!is_lightInlet(arg))
        return false;
    return true;
}
exports.is_fullInlet = is_fullInlet;
function is_lightOutlet(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('tagtask'))
        return false;
    if (typeof arg.tagtask !== 'string')
        return false;
    return true;
}
exports.is_lightOutlet = is_lightOutlet;
function is_fullOutlet(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('uuid'))
        return false;
    if (typeof arg.uuid !== 'string')
        return false;
    if (!arg.hasOwnProperty('index'))
        return false;
    if (typeof arg.index !== 'number')
        return false;
    if (!is_lightOutlet(arg))
        return false;
    return true;
}
exports.is_fullOutlet = is_fullOutlet;
function is_link(arg) {
    if (!arg)
        return false;
    if (!arg.hasOwnProperty('source'))
        return false;
    if (typeof arg.source !== 'string')
        return false;
    if (!arg.hasOwnProperty('target'))
        return false;
    if (typeof arg.target !== 'string')
        return false;
    return true;
}
exports.is_link = is_link;
function is_lightTopo(arg) {
    if (!arg)
        return false;
    // Inlets
    if (!arg.hasOwnProperty('inlets'))
        return false;
    if (!Array.isArray(arg.inlets))
        return false;
    for (let n of arg.inlets) {
        if (!is_lightInlet(n))
            return false;
    }
    // Outlets
    if (!arg.hasOwnProperty('outlets'))
        return false;
    if (!Array.isArray(arg.outlets))
        return false;
    for (let n of arg.outlets) {
        if (!is_lightOutlet(n))
            return false;
    }
    // Links
    if (!arg.hasOwnProperty('links'))
        return false;
    if (!Array.isArray(arg.links))
        return false;
    for (let l of arg.links) {
        if (!is_link(l))
            return false;
    }
    return true;
}
exports.is_lightTopo = is_lightTopo;
function is_fullTopo(arg) {
    if (!arg)
        return false;
    // Inlets
    if (!arg.hasOwnProperty('inlets'))
        return false;
    if (!Array.isArray(arg.inlets))
        return false;
    for (let n of arg.inlets) {
        if (!is_fullInlet(n))
            return false;
    }
    // Outlets
    if (!arg.hasOwnProperty('outlets'))
        return false;
    if (!Array.isArray(arg.outlets))
        return false;
    for (let n of arg.outlets) {
        if (!is_fullOutlet(n))
            return false;
    }
    // Links
    if (!arg.hasOwnProperty('links'))
        return false;
    if (!Array.isArray(arg.links))
        return false;
    for (let l of arg.links) {
        if (!is_link(l))
            return false;
    }
    return true;
}
exports.is_fullTopo = is_fullTopo;
