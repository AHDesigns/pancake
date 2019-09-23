import React, { useState, useEffect, useReducer } from 'react';
import './App.scss';
import { IPrData, TUser, TRepoUserFilters } from '../types';
import { Provider } from './Socket';
import { RepoInfo } from './RepoSelector';
/* import { PrHistory } from './PrHistory'; */
import Repository from './Repo';
import { getUsers } from '../utils/fetchWrappers';

const initialSubscribedRepos: string[] = JSON.parse(window.localStorage.getItem('subscribedRepos') || '[]');
const initialUsers: TUser[] = [];
const intialRepoUserFilters: TRepoUserFilters = {
    all: {
        whitelist: false,
        users: [],
    },
};

export type filterAction =
    | { type: 'addUser'; data: { repo: string; user: TUser } }
    | { type: 'removeUser'; data: { repo: string; user: TUser } }
    | { type: 'setWhitelist'; data: { repo: string; whitelist: boolean } };

function filterReducer(state: TRepoUserFilters, action: filterAction): TRepoUserFilters {
    switch (action.type) {
        case 'setWhitelist': {
            const { repo, whitelist } = action.data;
            return {
                ...state,
                [repo]: {
                    ...state[repo],
                    whitelist,
                },
            };
        }
        case 'removeUser': {
            const { repo, user } = action.data;
            return {
                ...state,
                [repo]: {
                    ...state[repo],
                    users: state[repo].users.filter(usr => usr !== user),
                },
            };
        }
        case 'addUser': {
            const { repo, user } = action.data;
            return {
                ...state,
                [repo]: {
                    ...state[repo],
                    users: [...state[repo].users, user],
                },
            };
        }
        default:
            return state;
    }
}

const App: React.FC = () => {
    const [subscribedRepos, setSubscribedRepos] = useState(initialSubscribedRepos);
    const [repoUserFilters, setRepoUserFilters] = useReducer(filterReducer, intialRepoUserFilters);

    const [users, setUsers] = useState(initialUsers);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => {});
    }, []);

    return (
        <div className="App">
            <RepoInfo
                repoUserFilters={repoUserFilters}
                setRepoUserFilters={setRepoUserFilters}
                users={users}
                subscribedRepos={subscribedRepos}
                setSubscribedRepos={setSubscribedRepos}
            />
            <Provider subscribedRepos={subscribedRepos}>
                {(reposData: IPrData[]): JSX.Element[] =>
                    reposData.map(data => (
                        <Repository key={data.name} reposData={data} repoUserFilters={repoUserFilters} />
                    ))
                }
            </Provider>
            {/* <PrHistory /> */}
        </div>
    );
};

export default App;