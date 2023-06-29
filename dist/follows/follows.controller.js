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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsController = void 0;
const common_1 = require("@nestjs/common");
const response_interceptor_1 = require("../interceptors/response.interceptor");
const response_message_decorator_1 = require("../interceptors/response_message.decorator");
const follows_service_1 = require("./follows.service");
const create_follow_dto_1 = require("./dto/create-follow.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FollowsController = class FollowsController {
    constructor(followsService) {
        this.followsService = followsService;
    }
    async createFollow(CreateFollowDto) {
        return await this.followsService.createFollow(CreateFollowDto);
    }
    async getFollowers(id) {
        return await this.followsService.getFollowers(id);
    }
    async getFollowing(id) {
        return await this.followsService.getFollowing(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, response_message_decorator_1.ResponseMessage)('Follow created successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_follow_dto_1.CreateFollowDto]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "createFollow", null);
__decorate([
    (0, common_1.Get)('/:id/followers'),
    (0, response_message_decorator_1.ResponseMessage)('Followers fetched successfully'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)('/:id/following'),
    (0, response_message_decorator_1.ResponseMessage)('Following fetched successfully'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowsController.prototype, "getFollowing", null);
FollowsController = __decorate([
    (0, common_1.Controller)('follows'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [follows_service_1.FollowsService])
], FollowsController);
exports.FollowsController = FollowsController;
//# sourceMappingURL=follows.controller.js.map