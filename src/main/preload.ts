import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, ...data: any) => {
    //allowed channels to send from Renderer
    const allowedChannels: string[] = [
      "open-file-dialog",
      "save-file-dialog",
      "set-settings",
      "save-settings",
      "load-settings",
      "get-ability",
      "request-fftaData",
      "save-mission-log",
      "load-mission-log",
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data);
    }
  },

  receive: (channel: string, cb: any) => {
    const allowedChannels: string[] = [
      "FileName-Change",
      "get-seed",
      "get-settings",
      "get-fftaData",
      "get-missions",
      "File-saved",
    ];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
    /*cb refers to the callback function that will be
    invoked on the arguments when it is returned on the renderer*/
  },

  remove: (channel: string, cb: any) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
