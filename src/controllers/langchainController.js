const { spawn } = require('child_process');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'langchain', 'scripts', 'script.py');
const Chat = require("../models/chat");
const zlib = require('zlib');
const chatController = require('./chatController');


const executePython = async (script, args) => {
    const arguments = args.map(arg => arg.toString());
  
    const py = spawn("python", [script, ...arguments]);
  
    const result = await new Promise((resolve, reject) => {
        let output;
  
        // Get output from python script
        py.stdout.on('data', (data) => {
            output = data.toString();
        });
  
        // Handle erros
        py.stderr.on("data", (data) => {
            console.error(`[python] Error occured: ${data}`);
            reject(`Error occured in ${script}`);
        });
  
        py.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
            resolve(output);
        });
    });
  
    return result;
  }

const getLessonMessage = async (req, res) => {
    try {
        const { username, location_id, location, friend_name, friend_type, lesson_index, mini_lesson_index } = req.query;

        const result = await executePython(scriptPath, [
            username,
            location,
            friend_name,
            friend_type,
            lesson_index, 
            mini_lesson_index
        ]);

        await chatController.saveMessage(username, 'AI', location_id, result);
  
        //send message to user
        res.status(200).json({
            success: true,
            message: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
  };

  const getLessonMessageLoremIpsum = async (req, res) => {
    try {
        const lesson_index = req.query.lesson_index;
        const mini_lesson_index = req.query.mini_lesson_index;
        const result = lesson_index+""+mini_lesson_index+"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed scelerisque leo. Vestibulum tincidunt blandit enim, in mollis ipsum vestibulum eu. Vestibulum a rutrum massa. Mauris in suscipit enim. Pellentesque vel pellentesque enim, vitae accumsan felis. Proin eu justo non metus vulputate venenatis non et ipsum. Donec ut imperdiet erat, et ultricies tortor. Curabitur accumsan congue diam, sed dignissim erat auctor quis. Suspendisse mollis lectus sit amet purus hendrerit faucibus. Integer ac metus nisl. Phasellus ante dolor, mattis eu magna ac, scelerisque lacinia erat. Vestibulum et vehicula purus, quis sollicitudin magna."
  
        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error });
    }
  };

  const getAnswerToUserMessage = async (req, res) => {
    try {
        const {username, location_id, message} = req.body;


        //TODO get result message from llm

        await chatController.saveMessage(username, 'User', location_id, message);


        res.status(200).json({
            success: true,
            message: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getLessonMessage,
    getLessonMessageLoremIpsum,
    getAnswerToUserMessage
};