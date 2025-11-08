// chatroom.model.ts
import mongoose from "mongoose";

export interface IChatRoom {
  participants: mongoose.Types.ObjectId[];
  customer?: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
}

export type ChatRoomDocument = mongoose.Document & IChatRoom;

const chatRoomSchema = new mongoose.Schema<ChatRoomDocument>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách các user tham gia (Admin, Staff, Customer)
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Khách hàng cụ thể
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Danh sách các tin nhắn
});

// Tạo model từ schema
const ChatRoom: mongoose.Model<ChatRoomDocument> = mongoose.model<ChatRoomDocument>("ChatRoom", chatRoomSchema);

export default ChatRoom;