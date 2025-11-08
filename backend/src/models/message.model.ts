// message.model.ts
import mongoose from "mongoose";

export interface IMessage {
  content: string;
  timestamp: Date;
  sender?: mongoose.Types.ObjectId;
  chatRoom?: mongoose.Types.ObjectId;
}

export type MessageDocument = mongoose.Document & IMessage;

const messageSchema = new mongoose.Schema<MessageDocument>({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Tự động tạo timestamp khi khởi tạo message
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người gửi tin nhắn
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }, // Phòng chat chứa tin nhắn
});

// Tạo model từ schema
const Message: mongoose.Model<MessageDocument> = mongoose.model<MessageDocument>("Message", messageSchema);

export default Message;