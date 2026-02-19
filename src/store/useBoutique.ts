import { create } from "zustand";

export type CursorVariant = "classic" | "needle" | "yarn" | "minimal";

interface BoutiqueStore {
    cursorVariant: CursorVariant;
    setCursorVariant: (variant: CursorVariant) => void;
}

export const useBoutique = create<BoutiqueStore>((set) => ({
    cursorVariant: "classic",
    setCursorVariant: (variant) => set({ cursorVariant: variant }),
}));
