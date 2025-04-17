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
exports.Challenge = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const ChallengeHistory_1 = require("./ChallengeHistory");
const PrizeDetails_1 = require("./PrizeDetails");
let Challenge = class Challenge {
};
exports.Challenge = Challenge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Challenge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Challenge.prototype, "challenge_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Challenge.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }) // Admin can toggle active status (true or false)
    ,
    __metadata("design:type", Boolean)
], Challenge.prototype, "active_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }) // Registered users count, initially 0
    ,
    __metadata("design:type", Number)
], Challenge.prototype, "registered_users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User, (user) => user.challenges),
    __metadata("design:type", Array)
], Challenge.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChallengeHistory_1.ChallengeHistory, (challengeHistory) => challengeHistory.challenge),
    __metadata("design:type", Array)
], Challenge.prototype, "challengeHistory", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Challenge.prototype, "question_ids", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PrizeDetails_1.PrizeDetails, (prize) => prize.challenge, { nullable: true }),
    __metadata("design:type", Array)
], Challenge.prototype, "prizeDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "result_finalization", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Challenge.prototype, "event_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "start_datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "end_datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "total_marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "total_seats", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Challenge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Challenge.prototype, "updatedAt", void 0);
exports.Challenge = Challenge = __decorate([
    (0, typeorm_1.Entity)()
], Challenge);
