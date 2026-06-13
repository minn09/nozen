import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
	leftSidebarOpen: boolean;
	rightSidebarOpen: boolean;
	isMoodDialogOpen: boolean;
	isMobile: boolean;

	setLeftSidebarOpen: (open: boolean) => void;
	setRightSidebarOpen: (open: boolean) => void;
	setIsMoodDialogOpen: (open: boolean) => void;
	setIsMobile: (mobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
	persist(
		(set) => ({
			leftSidebarOpen: true,
			rightSidebarOpen: true,
			isMoodDialogOpen: false,
			isMobile: false,

			setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
			setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
			setIsMoodDialogOpen: (open) => set({ isMoodDialogOpen: open }),
			setIsMobile: (mobile) =>
				set({
					isMobile: mobile,
					leftSidebarOpen: !mobile,
					rightSidebarOpen: !mobile,
				}),
		}),
		{
			name: "ui:v1",
			partialize: (state) => ({
				leftSidebarOpen: state.leftSidebarOpen,
				rightSidebarOpen: state.rightSidebarOpen,
			}),
		},
	),
);
