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
exports.ChallengeHistory = void 0;
const typeorm_1 = require("typeorm");
const Challenge_1 = require("./Challenge");
const User_1 = require("./User");
let ChallengeHistory = class ChallengeHistory {
};
exports.ChallengeHistory = ChallengeHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChallengeHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Challenge_1.Challenge, (challenge) => challenge.challengeHistory),
    __metadata("design:type", Challenge_1.Challenge)
], ChallengeHistory.prototype, "challenge", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.challengeHistory),
    __metadata("design:type", User_1.User)
], ChallengeHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ChallengeHistory.prototype, "challenge_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChallengeHistory.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], ChallengeHistory.prototype, "correctAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], ChallengeHistory.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChallengeHistory.prototype, "prize_money", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "not_started" }) // default value for completion status
    ,
    __metadata("design:type", String)
], ChallengeHistory.prototype, "completionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ChallengeHistory.prototype, "prize_money_distribution_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChallengeHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ChallengeHistory.prototype, "updatedAt", void 0);
exports.ChallengeHistory = ChallengeHistory = __decorate([
    (0, typeorm_1.Entity)()
], ChallengeHistory);
