const { spawn } = require('child_process');
const path = require('path');
const lessonPath = path.join(__dirname, '..', 'langchain', 'scripts', 'lessonMessageGenerator.py');
const quizPath = path.join(__dirname, '..', 'langchain', 'scripts', 'quizMessageGenerator.py');
const welcomePath = path.join(__dirname, '..', 'langchain', 'scripts', 'welcomeMessageGenerator.py');
const chatController = require('./chatController');
const { readFileSync } = require('fs');


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

        const currentBlock = req.body.currentBlock;
        const currentLesson = req.body.currentLesson;
        const currentMinilesson = req.body.currentMinilesson;
        const progress = req.body.progress;
        const user = req.body.user;
        const land = req.body.land;

        const birthDate = new Date(user.dateOfBirth);
        const today = new Date();
        let userAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
        }

        const result = await executePython(welcomePath, [ //"../scripts/welcomeMessageGenerator.py"
            user.username,
            land.name,
            land.friendName,
            land.friendType,
            land.moduleName,
            land.moduleDecriptionKids,
            land.moduleDescriptionParents, 
            progress, 
            currentLesson, 
            currentMinilesson,
            currentBlock, 
            userAge,
            user.preferredLanguage
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

        const currentBlock = req.body.currentBlock;
        const currentLesson = req.body.currentLesson;
        const currentMinilesson = req.body.currentMinilesson;
        const user = req.body.user;
        const land = req.body.land;

        const birthDate = new Date(user.dateOfBirth);
        const today = new Date();
        let userAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
        }
      

        if(currentLesson > 0 && currentMinilesson === 0 && currentBlock === 0) await chatController.deleteChatByLocationId(user.username, land.id);


       // script = parseInt(currentBlock) == 3 ? "../scripts/quizMessageGenerator.py" :  "../scripts/lessonMessageGenerator.py"
       script = parseInt(currentBlock) == 3 ? quizPath :  lessonPath
       const result = await executePython(script, [
            user.username,
            land.name,
            land.friendName,
            land.friendType,
            land.moduleName,
            currentLesson, 
            currentMinilesson,
            currentBlock, 
            userAge,
            user.preferredLanguage
        ]);


        await chatController.saveMessage(user.username, 'AI', land.id, result);

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

        const {username, location_id, message} = req.body;

        await chatController.saveMessage(username, 'User', location_id, message);

        //TODO get result message from llm


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


const getLessonsndMiniLessonsName = async (req, res) => {

    try {

        const {locationName} = req.query;

        const dataPath = path.join(__dirname, '..', 'langchain', 'docs', locationName + '_converted.json');
        
        const data = readFileSync(dataPath)
        const jsonObject = JSON.parse(data);

        const transformedData = jsonObject.map(lesson => {
            return {
                lessonName: lesson.name,
                miniLessonsNames: lesson.sublessons.map(sublesson => sublesson.name)
            }
        });

    

        res.status(200).json({
            success: true,
            message: transformedData
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
    getLessonMessageLoremIpsum, 
    getWelcomeMessage,
    getLessonMessageAlt,
    getAnswerToUserMessage,
    getLessonsndMiniLessonsName
};