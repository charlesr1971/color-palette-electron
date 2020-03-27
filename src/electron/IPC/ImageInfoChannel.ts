import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "../../shared/IpcRequest";
import * as gm from "gm";
import {execSync} from "child_process";

export class ImageInfoChannel implements IpcChannelInterface {

  getName(): string {
    return 'image-info';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    let size = null;
    gm("src/app/assets/images/for-palette/1.jpg").size(function(err, value){
      // note : value may be undefined
      //console.log("ImageInfoChannel: handle: value: ",value);
      size = value;
    })
    event.sender.send(request.responseChannel, { size: size });
  }

}
