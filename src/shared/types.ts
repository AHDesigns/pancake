export type DateTime = string;

export type RateLimit = {
    limit: number;
    cost: number;
    nodeCount: number;
    remaining: number;
    resetAt: DateTime;
};

export type TUser = {
    name?: string;
    avatarUrl: string;
    id: string;
    login: string;
};

export interface IPrData {
    name: string;
    pullRequests: IPullRequest[];
    rateLimit: {
        limit: number;
        cost: number;
        nodeCount: number;
        remaining: number;
        resetAt: string;
    };
}

export function isPrData(data: any): data is IPrData {
    return typeof data === 'object' && typeof data.name === 'string' && Array.isArray(data.pullRequests);
}

export enum EnumBoardStatus {
    NEW = 'NEW',
    UNCHANGED = 'UNCHANGED',
    UPDATED = 'UPDATED',
}

export enum reviewStates {
    PENDING = 'PENDING',
    COMMENTED = 'COMMENTED',
    APPROVED = 'APPROVED',
    CHANGES_REQUESTED = 'CHANGES',
    DISMISSED = 'DISMISSED',
}

export enum Mergeable {
    CONFLICTING = 'CONFLICTING',
    MERGEABLE = 'MERGEABLE',
    UNKNOWN = 'UNKNOWN',
}

export enum MergeStateStatus {
    BEHIND = 'BEHIND',
    BLOCKED = 'BLOCKED',
    CLEAN = 'CLEAN',
    DIRTY = 'DIRTY',
    DRAFT = 'DRAFT',
    HAS_HOOKS = 'HAS',
    UNKNOWN = 'UNKNOWN',
    UNSTABLE = 'UNSTABLE',
}

export enum StatusState {
    EXPECTED = 'EXPECTED',
    ERROR = 'ERROR',
    FAILURE = 'FAILURE',
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
}

export interface IUniqueReview {
    state: reviewStates;
    createdAt: string;
    authorAssociation: string;
    url: string;
    author: {
        login: string;
        avatarUrl: string;
    };
    onBehalfOf?: {
        login: string;
        avatarUrl: string;
    };
}

export type UserReview = { userName: string; avatarUrl: string };
export type TeamReview = { teamName: string; avatarUrl: string };

export function isUserReview(data: UserReview | TeamReview): data is UserReview {
    return (data as UserReview).userName !== undefined;
}

export type IReviewRequest = {
    requestedReviewer: UserReview | TeamReview;
};

export interface IPullRequest {
    number: number;
    baseRefName: string;
    headRefName: string;
    labels: {
        nodes: Array<{
            name: string;
        }>;
    };
    repository: {
        id: string;
    };
    id: string;
    // TODO: this shouldn't be optional, the types need to be combined
    boardStatus?: EnumBoardStatus;
    updatedAt: string;
    createdAt: string;
    isDraft: boolean;
    mergeStateStatus: MergeStateStatus;
    mergeable: Mergeable;
    title: string;
    url: string;
    author?: {
        login: string;
        avatarUrl: string;
    };
    reviews: {
        state: reviewStates;
        uniqueReviews: IUniqueReview[];
    };
    reviewRequests: {
        nodes: IReviewRequest[];
    };
    statuses: {
        commitUrl: string;
        message: string;
        status?: {
            contexts: {
                description: string;
                avatarUrl: string;
                state: StatusState;
            };
            state: StatusState;
        };
    };
}

export type IPrInfo = {
    name: string;
    owner: string;
    prCount: number;
    reviewsCount: number;
};

export function isPrInfo(data: any): data is IPrInfo {
    return (
        typeof data === 'object' &&
        typeof data.name === 'string' &&
        typeof data.owner === 'string' &&
        typeof data.prCount === 'number' &&
        typeof data.reviewsCount === 'number'
    );
}
