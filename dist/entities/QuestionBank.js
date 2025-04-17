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
exports.QuestionBank = void 0;
const typeorm_1 = require("typeorm");
const Subject_1 = require("./Subject");
const UserAnsweredQuestions_1 = require("./UserAnsweredQuestions");
let QuestionBank = class QuestionBank {
};
exports.QuestionBank = QuestionBank;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuestionBank.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionBank.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], QuestionBank.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], QuestionBank.prototype, "correct_answer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QuestionBank.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject_1.Subject, (subject) => subject.questions),
    __metadata("design:type", Subject_1.Subject)
], QuestionBank.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], QuestionBank.prototype, "eligibility_flag", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserAnsweredQuestions_1.UserAnsweredQuestions, (userAnsweredQuestion) => userAnsweredQuestion.question // Correct inverse side
    ),
    __metadata("design:type", Array)
], QuestionBank.prototype, "answeredBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)() // Automatically sets the current timestamp when the entity is created
    ,
    __metadata("design:type", Date)
], QuestionBank.prototype, "createdAt", void 0);
exports.QuestionBank = QuestionBank = __decorate([
    (0, typeorm_1.Entity)()
], QuestionBank);
