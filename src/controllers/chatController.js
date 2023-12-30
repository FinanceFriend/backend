const Chat = require("../models/chat");
const zlib = require('zlib');

const getChatForUserAndLocation = async (req, res) => {
  const { username, location_id } = req.query;

  try {
    const chatDoc = await Chat.findOne({ username, location_id: parseInt(location_id) });

    if (chatDoc) {
      // Decompress each message in the nested array structure
      const decompressedMessagesList = chatDoc.messagesList.map(group => 
        group.map(message => {
          const buffer = Buffer.from(message.compressedContent, 'base64');
          const decompressed = zlib.gunzipSync(buffer).toString();
          return {
            sender: message.sender,
            content: decompressed
          };
        })
      );

      res.status(200).json({
        success: true,
        messages: decompressedMessagesList
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No chat document found for the specified username and location_id."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const saveMessage = async (req, res) => {

  try{

    const {username, location_id, message} = req.body;

    const compressedResult = zlib.gzipSync(message).toString('base64');
        
    const newMessage = {
        sender: 'User',
        compressedContent: compressedResult,
        isCompressed: true
    };

    // Find or create a document for the user and module
    let chatDoc = await Chat.findOne({ username, location_id });
    
    if (!chatDoc ) {
        chatDoc = new Chat({ username, location_id, messagesList: [[newMessage]] });
    }else{

        if (chatDoc.messagesList.length === 0 || chatDoc.messagesList[chatDoc.messagesList.length - 1].length === 0) {
            chatDoc.messagesList.push([newMessage]);
        } else {
            chatDoc.messagesList[chatDoc.messagesList.length - 1].push(newMessage);
        }

    }

    // Save the updated document
    await chatDoc.save();

    res.status(200).json({
      success: true,
      message: "Message added sucessfuly",
    });

  } catch(error){
    res.status(500).json({
      success: false,
      message: error
    });
  }

};
  

function decompressMessage(compressedText) {
  try {
    
  } catch (error) {
    console.error('Decompression error:', error);
    return ''; // Return an empty string or handle the error as required
  }
}

module.exports = {
    getChatForUserAndLocation,
    saveMessage
};