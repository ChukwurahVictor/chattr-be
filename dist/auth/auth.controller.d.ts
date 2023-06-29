import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            displayName: string;
        };
        accessToken: string;
    }>;
    login({ email, password }: LoginDto): Promise<AuthEntity>;
}
