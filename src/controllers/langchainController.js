// Import required modules
const { spawn } = require('child_process');
const path = require('path');
const chatController = require('./chatController');
const { readFileSync } = require('fs');

// Define file paths for Python scripts
const lessonPath = path.join(__dirname, '..', 'langchain', 'scripts', 'lessonMessageGenerator.py');
const quizPath = path.join(__dirname, '..', 'langchain', 'scripts', 'quizMessageGenerator.py');
const welcomePath = path.join(__dirname, '..', 'langchain', 'scripts', 'welcomeMessageGenerator.py');
const answerUserPath = path.join(__dirname, '..', 'langchain', 'scripts', 'userAnswerGenerator.py');
const freeformPath = path.join(__dirname, '..', 'langchain', 'scripts', 'freeformMessageGenerator.py');
const freeformWelcomePath = path.join(__dirname, '..', 'langchain', 'scripts', 'freeformWelcomeMessageGenerator.py');
const imageGeneratorPath = path.join(__dirname, '..', 'langchain', 'scripts', 'imageGenerator.py');
const questionEvaluationPath = path.join(__dirname, '..', 'langchain', 'scripts', 'questionEval.py');

// Function to execute Python scripts
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
            console.error(`[python] Error occurred: ${data}`);
            reject(`Error occurred in ${script}`);
        });

        py.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
            resolve(output);
        });
    });

    return result;
}

const calculateAge = async (birthDate) => {
    
    const today = new Date();
    let userAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        userAge--;
    }
    
    return userAge;
}



// get test message
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

// welcome message should be generated every time the user enters a land 
// if it is the first time the user enters the land, the message should be different than if the user has already been there
const getWelcomeMessage = async (req, res) => {
    try {

        const currentBlock = req.body.currentBlock;
        const currentLesson = req.body.currentLesson;
        const currentMinilesson = req.body.currentMinilesson;
        const progress = req.body.progress;
        const user = req.body.user;
        const land = req.body.land;

        const userAge = await calculateAge(new Date(user.dateOfBirth));

        // Imagination Jungle is the only land where the welcome message is different because it does not have modules, lessons and minilessons
        const script = land == "Imagination Jungle" ? freeformWelcomePath : welcomePath

        const result = await executePython(script, [  //"../scripts/welcomeMessageGenerator.py"
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

// get lesson message - should be generated every time the user clicks on the next button
// Alt name is here only for historical reasons
const getLessonMessageAlt = async (req, res) => {
    try {

        const currentBlock = req.body.currentBlock;
        const currentLesson = req.body.currentLesson;
        const currentMinilesson = req.body.currentMinilesson;
        const user = req.body.user;
        const land = req.body.land;

        const userAge = await calculateAge(new Date(user.dateOfBirth));

        if(currentLesson > 0 && currentMinilesson === 0 && currentBlock === 0) await chatController.deleteChatByLocationId(user.username, land.id);


       // script = parseInt(currentBlock) == 3 ? "../scripts/quizMessageGenerator.py" :  "../scripts/lessonMessageGenerator.py"
        script = parseInt(currentBlock) == 2 ? quizPath :  lessonPath
        const result = await executePython(script, [
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


        if(currentBlock < 2) await chatController.saveMessage(user.username, 'AI', land.id, result);

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

// get answer to user message - should be generated every time the user sends a message via chat prompt 
const getAnswerToUserMessage = async (req, res) => {
    try {

        const currentLesson = req.body.currentLesson;
        const currentMinilesson = req.body.currentMinilesson;
        const user = req.body.user;
        const land = req.body.land;
        const message = req.body.message;

        const userAge = await calculateAge(new Date(user.dateOfBirth));

        const historyContext = await chatController.getHistoryMessages(user.username, land.id);

        await chatController.saveMessage(user.username, 'User', land.id, message);

        const result = await executePython(answerUserPath, [
            user.username,
            land.name,
            land.friendName,
            land.friendType,
            land.moduleName,
            currentLesson, 
            currentMinilesson,
            userAge,
            user.preferredLanguage,
            message,
            historyContext
        ]);

        await chatController.saveMessage(user.username, 'AI', land.id, result);

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// get freeform message - should be generated every time the user sends a message in Imaginary Jungle via chat prompt
// depending on the button that the user has clicked, it generates a text prompt or an image
const getFreeformMessage = async (req, res) => {
    try {
        const user = req.body.user;
        const land = req.body.land;
        const message = req.body.message;
        const type = req.body.type;

        const userAge = await calculateAge(new Date(user.dateOfBirth));
        const historyContext = await chatController.getHistoryMessages(user.username, land.id);

        if (type == "image"){
            const result = await executePython(imageGeneratorPath, [
                message
            ]);
        } else {
            await chatController.saveMessage(user.username, 'User', land.id, message);
            const result = await executePython(freeformPath, [
                user.username,
                userAge,
                user.preferredLanguage,
                message,
                historyContext
            ]);
            await chatController.saveMessage(user.username, 'AI', land.id, result);
        }
        
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    
    };
}

const getQuestionEvaluation = async (req, res) => {
    try {
        const user = req.body.user;
        const question = req.body.question;
        const userAnswer = req.body.userAnswer;
        const correctAnswerExample = req.body.correctAnswerExample;

        const result = await executePython(questionEvaluationPath, [
            question,
            userAnswer,
            user.preferredLanguage,
            correctAnswerExample
        ]);

        res.status(200).json({
            success: true,
            message: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const getLessonsndMiniLessonsName = async (req, res) => {

    try {

        const {locationName} = req.query;

        const dataPath = path.join(__dirname, '..', 'langchain', 'docs', locationName + '.json');
        
        const data = readFileSync(dataPath)
        const jsonObject = JSON.parse(data);

        const transformedData = jsonObject.map(lesson => {
            return {
                lessonName: lesson.name,
                miniLessonsNames: lesson.mini_lessons.map(mini_lesson => mini_lesson.name)
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
    getLessonsndMiniLessonsName,
    getFreeformMessage,
    getQuestionEvaluation
};