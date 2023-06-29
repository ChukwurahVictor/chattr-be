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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const response_interceptor_1 = require("../interceptors/response.interceptor");
const response_message_decorator_1 = require("../interceptors/response_message.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_user_dto_1 = require("./dto/update-user.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers() {
        return this.usersService.findAllUsers();
    }
    async getSingleUser(id) {
        return this.usersService.findOneUser(id);
    }
    async updateUser(id, updateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }
    async removeUser(id) {
        return this.usersService.removeUser(id);
    }
    async getUserPosts(id) {
        return this.usersService.getUserPosts(id);
    }
    async getUserReactions(id) {
        return 'Fetch user reactions';
    }
    async getUserFollows(id) {
        return 'Fetch user follows';
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, response_message_decorator_1.ResponseMessage)('Users fetched Successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, response_message_decorator_1.ResponseMessage)('User fetched Successfully'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSingleUser", null);
__decorate([
    (0, common_1.Patch)(),
    (0, response_message_decorator_1.ResponseMessage)('User updated Successfully'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(),
    (0, response_message_decorator_1.ResponseMessage)('Users removed Successfully'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Get)(':id/posts'),
    (0, response_message_decorator_1.ResponseMessage)('Users posts fetched Successfully'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPosts", null);
__decorate([
    (0, common_1.Get)('reactions'),
    (0, response_message_decorator_1.ResponseMessage)('Users reactions fetched Successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserReactions", null);
__decorate([
    (0, common_1.Get)('follows'),
    (0, response_message_decorator_1.ResponseMessage)('Users reactions fetched Successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserFollows", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map