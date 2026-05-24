import { create } from 'zustand';

const useUIStore = create((set, get) => ({
    // Sidebar state
    sidebarCollapsed: false,
    sidebarWidth: 280,

    // Panel visibility
    uploadPanelOpen: false,
    sourceInspectorOpen: false,
    retrievalPanelOpen: false,

    // Source inspector data
    selectedSource: null,

    // Theme
    theme: 'dark',

    // Mobile responsive
    isMobile: false,
    mobileMenuOpen: false,

    // Actions
    toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
    })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setSidebarWidth: (width) => set({ sidebarWidth: width }),

    toggleUploadPanel: () => set((state) => ({
        uploadPanelOpen: !state.uploadPanelOpen
    })),
    setUploadPanelOpen: (open) => set({ uploadPanelOpen: open }),

    toggleSourceInspector: () => set((state) => ({
        sourceInspectorOpen: !state.sourceInspectorOpen
    })),
    setSourceInspectorOpen: (open) => set({ sourceInspectorOpen: open }),

    toggleRetrievalPanel: () => set((state) => ({
        retrievalPanelOpen: !state.retrievalPanelOpen
    })),
    setRetrievalPanelOpen: (open) => set({ retrievalPanelOpen: open }),

    setSelectedSource: (source) => set({ selectedSource: source }),

    setTheme: (theme) => set({ theme }),
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
    })),

    setIsMobile: (isMobile) => set({ isMobile }),
    toggleMobileMenu: () => set((state) => ({
        mobileMenuOpen: !state.mobileMenuOpen
    })),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

    // Reset all panels
    closeAllPanels: () => set({
        uploadPanelOpen: false,
        sourceInspectorOpen: false,
        retrievalPanelOpen: false,
        mobileMenuOpen: false,
    }),
}));

export default useUIStore;