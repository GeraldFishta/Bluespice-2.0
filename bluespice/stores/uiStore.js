// stores/uiStore.js
import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  // State
  sidebarOpen: true, // Default open per desktop
  modals: {
    employeeForm: false,
    employeeEdit: false,
    payrollPreview: false,
    deleteConfirm: false,
    settings: false,
  },
  notifications: [],

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  // Modal actions
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },

  closeAllModals: () => {
    set({
      modals: {
        employeeForm: false,
        employeeEdit: false,
        payrollPreview: false,
        deleteConfirm: false,
        settings: false,
      },
    });
  },

  // Notification actions
  addNotification: (notification) => {
    const id = Date.now();
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id,
          type: "info",
          duration: 5000,
          ...notification,
        },
      ],
    }));
    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Getters
  isModalOpen: (modalName) => get().modals[modalName] || false,
}));
