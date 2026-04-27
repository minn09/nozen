import { create } from "zustand";

interface UIState {
	leftSidebarOpen: boolean;
	rightSidebarOpen: boolean;
	isMoodDialogOpen: boolean;
	isMobile: boolean;
	theme: "light" | "dark" | "system";

	setLeftSidebarOpen: (open: boolean) => void;
	setRightSidebarOpen: (open: boolean) => void;
	setIsMoodDialogOpen: (open: boolean) => void;
	setIsMobile: (mobile: boolean) => void;
	setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>((set) => ({
	leftSidebarOpen: true,
	rightSidebarOpen: true,
	isMoodDialogOpen: false,
	isMobile: false,
	theme: "light",

	setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
	setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
	setIsMoodDialogOpen: (open) => set({ isMoodDialogOpen: open }),
	setIsMobile: (mobile) =>
		set({
			isMobile: mobile,
			leftSidebarOpen: !mobile,
			rightSidebarOpen: !mobile,
		}),
	setTheme: (theme) => set({ theme }),
}));
