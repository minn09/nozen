import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

interface UserPreferencesState {
	confirmBeforeDelete: boolean;
	theme: "light" | "dark" | "system";

	setConfirmBeforeDelete: (value: boolean) => void;
	setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
	subscribeWithSelector(
		persist(
			(set) => ({
				confirmBeforeDelete: true,
				theme: "system",

				setConfirmBeforeDelete: (value) => set({ confirmBeforeDelete: value }),
				setTheme: (theme) => set({ theme }),
			}),
			{
				name: "user-preferences",
			},
		),
	),
);
