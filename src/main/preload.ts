import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  send: (channel :string, ...data: any) => {
    //allowed channels to send from Renderer
    const allowedChannels = ["open-file-dialog", "save-file-dialog"];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...data);
    }
  },
  
  receive: (channel: string, cb: any) => {
    const allowedChannels: string[] = [];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
    /*cb refers to the callback function that will be
    invoked on the arguments when it is returned on the renderer*/
  },
});
