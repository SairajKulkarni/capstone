import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";

export const getMessages = async (req, res) => {
  const { id: connectionId } = req.params;
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: connectionId },
        { senderId: connectionId, receiverId: userId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  try {
    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
