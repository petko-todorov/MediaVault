import { create } from 'zustand';
import { createUserSlice } from './slices/createUserSlice';

export const useStore = create((set) => ({
    ...createUserSlice(set),
}));
