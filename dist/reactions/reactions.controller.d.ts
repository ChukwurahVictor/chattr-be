import { ReactionsService } from './reactions.service';
export declare class ReactionsController {
    private readonly reactionsService;
    constructor(reactionsService: ReactionsService);
    createReaction(): Promise<string>;
    getReactions(): Promise<string>;
    getReaction(): Promise<string>;
    updateReaction(): Promise<string>;
    removeReaction(): Promise<string>;
}
