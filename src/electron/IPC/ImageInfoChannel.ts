import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "../../shared/IpcRequest";
import * as gm from "gm";
import {execSync} from "child_process";

export class ImageInfoChannel implements IpcChannelInterface {

  rootDir = "dist";

  getName(): string {
    return 'image-info';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    let size = null;
    gm(this.rootDir + "/app/assets/images/output/1_out_image.jpg").size(function(err, value){
      size = value;
    })
    event.sender.send(request.responseChannel, { size: size });
  }

}
