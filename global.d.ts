import { Message } from "eris"

declare module "eris" {
  export interface Message {
    send(content: MessageContent, file?: MessageFile): Promise<Message>;
  }
}