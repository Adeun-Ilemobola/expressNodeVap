"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Utility_1 = require("./Utility");
const db_1 = __importDefault(require("./Configure/db"));
const user_1 = __importDefault(require("./Configure/user"));
const app = (0, express_1.default)();
const port = 3000;
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
app.get('/api/verifySession', (req, res) => {
    const body = req.body;
    if (!body) {
        res.status(200).send({ error: "Invalid session " });
    }
});
app.post('/api/Login', (req, res) => {
    const body = req.body;
    if (!body) {
        res.status(401).send({ error: 'Invalid Credentials' });
        return;
    }
    //     verify the user exist
    //    compare the users password to the using found password hushed
    //     the user is a much create a session to back to the user
    const op = true;
    const startDate = new Date();
    if (op) {
        res.status(200).send({
            user: {
                username: body.username,
                email: "test@test.com",
                id: "test@test.com",
            },
            sessionID: "43858pereugfiusodisiodfguos",
            Expire: (0, Utility_1.addDays)(startDate, 1).getMilliseconds()
        });
    }
});
app.post('/api/updateUserNotes', (req, res) => {
});
app.post('/api/testUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.create({
            username: "test",
            email: "test@test.com",
            password: "testdsfsdfdsfsd",
        });
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
