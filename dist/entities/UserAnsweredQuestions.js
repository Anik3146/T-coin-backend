"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAnsweredQuestions = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User"); // Assuming you have a User entity
const QuestionBank_1 = require("./QuestionBank"); // Assuming this is your QuestionBank entity
let UserAnsweredQuestions = class UserAnsweredQuestions {
};
exports.UserAnsweredQuestions = UserAnsweredQuestions;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAnsweredQuestions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.answeredQuestions, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_1.User)
], UserAnsweredQuestions.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => QuestionBank_1.QuestionBank, (question) => question.answeredBy, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "questionId" }),
    __metadata("design:type", QuestionBank_1.QuestionBank)
], UserAnsweredQuestions.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }) // Assuming score is an integer, you can adjust the default or type as needed
    ,
    __metadata("design:type", Number)
], UserAnsweredQuestions.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UserAnsweredQuestions.prototype, "answeredAt", void 0);
exports.UserAnsweredQuestions = UserAnsweredQuestions = __decorate([
    (0, typeorm_1.Entity)()
], UserAnsweredQuestions);
