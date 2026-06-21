import { create } from "zustand";

interface UIState {
	leftSidebarOpen: boolean;
	rightSidebarOpen: boolean;
	isMoodDialogOpen: boolean;
	isMobile: boolean;
	theme: "light" | "dark" | "system";
	zenMode: boolean;

	setLeftSidebarOpen: (open: boolean) => void;
	setRightSidebarOpen: (open: boolean) => void;
	setIsMoodDialogOpen: (open: boolean) => void;
	setIsMobile: (mobile: boolean) => void;
	setTheme: (theme: "light" | "dark" | "system") => void;
	toggleZenMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	leftSidebarOpen: true,
	rightSidebarOpen: true,
	isMoodDialogOpen: false,
	isMobile: false,
	theme: "light",
	zenMode: false,

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
	toggleZenMode: () =>
		set((state) =>
			state.zenMode
				? { zenMode: false, leftSidebarOpen: true, rightSidebarOpen: true }
				: { zenMode: true, leftSidebarOpen: false, rightSidebarOpen: false },
		),
}));
