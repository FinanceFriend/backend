const { spawn } = require('child_process');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'langchain', 'scripts', 'lessonMessageGenerator.py');
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

        // Handle errors
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
            error: error
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

const getWelcomeMessage = async (req, res) => {
    try {
        const {username, userAge, userLanguage, locationName, friendName, friendType, moduleName, moduleDecriptionKids, moduleDescriptionParents, progress, currentLesson, currentMinilesson, currentBlock} = req.query;

        const result = await executePython("../scripts/welcomeMessageGenerator.py", [
            username,
            locationName,
            friendName,
            friendType,
            moduleName,
            moduleDecriptionKids,
            moduleDescriptionParents, 
            progress, 
            currentLesson, 
            currentMinilesson,
            currentBlock, 
            userAge,
            userLanguage
        ]);

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
};

const getLessonMessageAlt = async (req, res) => {
    try {
        const {username, userAge, userLanguage, locationName, locationId, friendName, friendType, moduleName, moduleDecriptionKids, moduleDescriptionParents, progress, currentLesson, currentMinilesson, currentBlock} = req.body;

        if(currentLesson > 0 && currentMinilesson === 0 && currentBlock !== 3) await chatController.deleteChatByLocationId(username, locationId);

        script = parseInt(currentBlock) == 3 ? "../scripts/quizMessageGenerator.py" :  "../scripts/lessonMessageGenerator.py"
        const result = await executePython(script, [
            username,
            locationName,
            friendName,
            friendType,
            moduleName,
            currentLesson, 
            currentMinilesson,
            currentBlock, 
            userAge,
            userLanguage
        ]);


        await chatController.saveMessage(username, 'AI', locationId, result);

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error
        });
    }
}

  const getAnswerToUserMessage = async (req, res) => {
    try {
        const {username, locationId, message} = req.body;


        //TODO get result message from llm

        await chatController.saveMessage(username, 'User', locationId, message);


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
    getWelcomeMessage,
    getLessonMessageAlt,
    getAnswerToUserMessage
};