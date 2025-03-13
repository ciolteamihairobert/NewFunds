export const buttonActions = [
    { id: 'minimize-btn', action: () => window.electronAPI.minimizeWindow() },
    { id: 'maximize-btn', action: () => window.electronAPI.maximizeWindow() },
    { id: 'close-btn', action: () => window.electronAPI.closeWindow() },
];