import { IUser } from "@mirrorworld/web3.js";
import mitt from "mitt";

type Events = {
  user: IUser;
};

export const eventBus = mitt<Events>();
