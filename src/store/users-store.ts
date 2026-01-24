import {create} from 'zustand';
import type { IUser } from '@/interfaces';

const usersGlobalStore = create((set) => ({
    user : null,
    setUser: (payload: IUser) => set(() => ({ user: payload})),
}))

export default usersGlobalStore

export interface IUsersStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
}