import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type DashboardLayout = 'grid' | 'list';
type ThemePreference = 'system' | 'light' | 'dark';

interface UserPreferencesState {
    layout: DashboardLayout;
    theme: ThemePreference;
    sidebarCollapsed: boolean;
    notificationsEnabled: boolean;
    widgets: string[];

    // Actions
    setLayout: (layout: DashboardLayout) => void;
    setTheme: (theme: ThemePreference) => void;
    toggleSidebar: () => void;
    toggleNotifications: () => void;
    toggleWidget: (widgetId: string) => void;
    resetPreferences: () => void;
}

const initialState = {
    layout: 'grid' as DashboardLayout,
    theme: 'system' as ThemePreference,
    sidebarCollapsed: false,
    notificationsEnabled: true,
    widgets: ['analytics', 'recent-activity'],
};

export const usePreferencesStore = create<UserPreferencesState>()(
    persist(
        (set) => ({
            ...initialState,

            setLayout: (layout) => set({ layout }),
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            toggleWidget: (widgetId) => set((state) => {
                const widgets = state.widgets.includes(widgetId)
                    ? state.widgets.filter(w => w !== widgetId)
                    : [...state.widgets, widgetId];
                return { widgets };
            }),
            resetPreferences: () => set(initialState),
        }),
        {
            name: 'user-preferences-storage', // unique name
            storage: createJSONStorage(() => localStorage), // mimicking async storage structure
            // Partialize: Optionally only save some fields
            // partialize: (state) => ({ theme: state.theme }), 
        }
    )
);
