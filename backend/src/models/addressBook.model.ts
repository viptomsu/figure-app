// addressBook.model.ts
import mongoose from "mongoose";

export interface IAddressBook {
  user: mongoose.Types.ObjectId;
  recipientName: string;
  phoneNumber: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  email: string;
}

export type AddressBookDocument = mongoose.Document & IAddressBook;

const addressBookSchema = new mongoose.Schema<AddressBookDocument>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu tới User
  recipientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true }, // Thêm trường email
});

// Tạo model từ schema
const AddressBook: mongoose.Model<AddressBookDocument> = mongoose.model<AddressBookDocument>("AddressBook", addressBookSchema);

export default AddressBook;