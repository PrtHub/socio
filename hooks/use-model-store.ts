import { Server } from '@prisma/client'
import {create } from 'zustand'

export type ModelType = 'createServer' | 'invite' | 'editServer'

interface ModelData {
    server?: Server
}

interface ModelStore {
    type: ModelType | null
    data: ModelData
    isOpen: boolean
    onOpen: (type: ModelType, data?: ModelData) => void
    onClose: () => void
}

export const useModelStore = create<ModelStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ isOpen: false }),
}))