"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minMax = minMax;
exports.idGenerator = idGenerator;
exports.addDays = addDays;
function minMax(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function idGenerator(length = 10) {
    const alphabet = "zxcvbnmlkjhgfdsaqwertyuiopZXCVBNMLKJHGFDSAQWERTYUIOP0987654321";
    let segment = 0;
    let id = "";
    while (segment < 3) {
        for (let i = 0; i < length; i++) {
            id += alphabet.charAt(minMax(0, alphabet.length - 1));
        }
        if (segment < 2) {
            id += '-';
        }
        segment++;
    }
    return id;
}
function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}
