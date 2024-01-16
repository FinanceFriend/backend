// Import required modules
const { spawn } = require("child_process");
const path = require("path");
const chatController = require("./chatController");
const dateCalc = require("../utilities/dateCalc");
const { readFileSync } = require("fs");
const { updateStats } = require("./statsController");

// Define file paths for Python scripts
const lessonPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "lessonMessageGenerator.py"
);
const quizPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "quizMessageGenerator.py"
);
const welcomePath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "welcomeMessageGenerator.py"
);
const answerUserPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "userAnswerGenerator.py"
);
const freeformPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "freeformMessageGenerator.py"
);
const freeformWelcomePath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "freeformWelcomeMessageGenerator.py"
);
const imageGeneratorPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "imageGenerator.py"
);
const questionEvaluationPath = path.join(
  __dirname,
  "..",
  "langchain",
  "scripts",
  "questionEval.py"
);

// Function to execute Python scripts
const executePython = async (script, args) => {
  const arguments = args.map((arg) => arg.toString());

  const py = spawn("python", [script, ...arguments]);

  const result = await new Promise((resolve, reject) => {
    let output;

    // Get output from python script
    py.stdout.on("data", (data) => {
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
};

// get test message
const getLessonMessageLoremIpsum = async (req, res) => {
  try {
    const currentBlock = req.body.currentBlock;
    const currentLesson = req.body.currentLesson;
    const currentMinilesson = req.body.currentMinilesson;
    const user = req.body.user;
    const land = req.body.land;

    let result =
      currentBlock +
      " " +
      currentLesson +
      " " +
      currentMinilesson +
      " " +
      user +
      " " +
      land +
      " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed scelerisque leo. Vestibulum tincidunt blandit enim, in mollis ipsum vestibulum eu. Vestibulum a rutrum massa. Mauris in suscipit enim. Pellentesque vel pellentesque enim, vitae accumsan felis. Proin eu justo non metus vulputate venenatis non et ipsum. Donec ut imperdiet erat, et ultricies tortor. Curabitur accumsan congue diam, sed dignissim erat auctor quis. Suspendisse mollis lectus sit amet purus hendrerit faucibus. Integer ac metus nisl. Phasellus ante dolor, mattis eu magna ac, scelerisque lacinia erat. Vestibulum et vehicula purus, quis sollicitudin magna.";

    if (currentBlock == 2) {
      result =
        '"\\n```json\\n[\\n\\t{\\n\\t\\t\\"question\\": \\"Financial mathematics is important for understanding everyday financial situations.\\",\\n\\t\\t\\"type\\": \\"True/False\\",\\n\\t\\t\\"correct_answer\\": \\"True\\"\\n\\t},\\n\\t{\\n\\t\\t\\"question\\": \\"What is the main purpose of learning financial arithmetic?\\",\\n\\t\\t\\"type\\": \\"Fill-in-the-Blank\\",\\n\\t\\t\\"correct_answer\\": \\"To make informed financial decisions\\"\\n\\t},\\n\\t{\\n\\t\\t\\"question\\": \\"Which of the following is an example of financial mathematics?\\",\\n\\t\\t\\"type\\": \\"Multiple Choice\\",\\n\\t\\t\\"correct_answer\\": \\"Calculating the future value of an investment\\",\\n\\t\\t\\"options\\": [\\"Calculating the area of a triangle\\", \\"Calculating the speed of a car\\", \\"Calculating the future value of an investment\\", \\"Calculating the volume of a cylinder\\"]\\n\\t},\\n\\t{\\n\\t\\t\\"question\\": \\"Financial mathematics is only relevant to adults.\\",\\n\\t\\t\\"type\\": \\"True/False\\",\\n\\t\\t\\"correct_answer\\": \\"False\\"\\n\\t},\\n\\t{\\n\\t\\t\\"question\\": \\"Which of the following is a benefit of learning financial mathematics?\\",\\n\\t\\t\\"type\\": \\"Multiple Choice\\",\\n\\t\\t\\"correct_answer\\": \\"Making informed decisions about investments\\",\\n\\t\\t\\"options\\": [\\"Making informed decisions about investments\\", \\"Making informed decisions about taxes\\", \\"Making informed decisions about stocks\\", \\"Making informed decisions about bonds\\"]\\n\\t}\\n]\\n```"\r\n';
    }

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
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

    const userAge = dateCalc.getAge(user.dateOfBirth);

    // Imagination Jungle is the only land where the welcome message is different because it does not have modules, lessons and minilessons
    const script =
      land == "Imagination Jungle" ? freeformWelcomePath : welcomePath;

    const result = await executePython(script, [
      //"../scripts/welcomeMessageGenerator.py"
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
      user.preferredLanguage,
    ]);

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
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

    const userAge = dateCalc.getAge(user.dateOfBirth);

    await updateProgressStatsInternally(
      user.username,
      land.id,
      currentBlock,
      currentMinilesson,
      currentLesson
    );

    if (currentLesson > 0 && currentMinilesson === 0 && currentBlock === 0)
      await chatController.deleteChatByLocationId(user.username, land.id);

    // script = parseInt(currentBlock) == 3 ? "../scripts/quizMessageGenerator.py" :  "../scripts/lessonMessageGenerator.py"
    script = parseInt(currentBlock) == 2 ? quizPath : lessonPath;
    const result = await executePython(script, [
      land.name,
      land.friendName,
      land.friendType,
      land.moduleName,
      currentLesson,
      currentMinilesson,
      currentBlock,
      userAge,
      user.preferredLanguage,
    ]);

    if (currentBlock < 2)
      await chatController.saveMessage(user.username, "AI", land.id, result);

    const nextIds = findNextBlockLessonAndMinilesson(land.id, currentLesson, currentMinilesson, currentBlock);

    res.status(200).json({
      success: true,
      message: result,
      nextIds
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

// get answer to user message - should be generated every time the user sends a message via chat prompt
const getAnswerToUserMessage = async (req, res) => {
  try {
    const currentLesson = req.body.currentLesson;
    const currentMinilesson = req.body.currentMinilesson;
    const user = req.body.user;
    const land = req.body.land;
    const message = req.body.message;

    const userAge = dateCalc.getAge(user.dateOfBirth);

    const historyContext = await chatController.getHistoryMessages(
      user.username,
      land.id
    );

    await chatController.saveMessage(user.username, "User", land.id, message);

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
      historyContext,
    ]);

    await chatController.saveMessage(user.username, "AI", land.id, result);

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get freeform message - should be generated every time the user sends a message in Imaginary Jungle via chat prompt
// depending on the button that the user has clicked, it generates a text prompt or an image
const getFreeformMessage = async (req, res) => {
  try {
    const user = req.body.user;
    const landId = req.body.landId;
    const message = req.body.message;
    const type = req.body.type;

    const userAge = dateCalc.getAge(user.dateOfBirth);
    const historyContext = await chatController.getHistoryMessages(
      user.username,
      landId
    );

    await chatController.saveMessage(user.username, "User", landId, message);

    let result;
    if (type == "image") {
        result = await executePython(imageGeneratorPath, [message]);
    } else {
        result = await executePython(freeformPath, [
            user.username,
            userAge,
            user.preferredLanguage,
            message,
            historyContext,
      ]);
      
    }

    await chatController.saveMessage(user.username, "AI", landId, result);

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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
      correctAnswerExample,
    ]);

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getLessonsndMiniLessonsName = async (req, res) => {
  try {
    const { locationName } = req.query;

    const dataPath = path.join(
      __dirname,
      "..",
      "langchain",
      "docs",
      locationName + ".json"
    );

    const data = readFileSync(dataPath);
    const jsonObject = JSON.parse(data);

    const transformedData = jsonObject.map((lesson) => {
      return {
        lessonName: lesson.name,
        miniLessonsNames: lesson.mini_lessons.map(
          (mini_lesson) => mini_lesson.name
        ),
      };
    });

    res.status(200).json({
      success: true,
      message: transformedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

async function updateProgressStatsInternally(
  username,
  locationId,
  blockId,
  minilessonId,
  lessonId
) {
  // Mock request object
  const req = {
    params: {
      username: username,
    },
    body: {
      progress: {
        locationId: locationId,
        blockId: blockId,
        minilessonId: minilessonId,
        lessonId: lessonId,
      },
    },
  };

  // Mock response object
  const res = {
    status: function (statusCode) {
      console.log("Status:", statusCode);
      return this;
    },
    json: function (data) {
      console.log("Data:", data);
      return this;
    },
  };

  await updateStats(req, res);
}

function findNextBlockLessonAndMinilesson(
  locationId,
  lessonId,
  minilessonId,
  blockId
) {
  const dataPath = path.join(
    __dirname,
    "..",
    "langchain",
    "docs",
    "locations.json"
  );

  const data = readFileSync(dataPath);
  const jsonObject = JSON.parse(data);

  const locationName = jsonObject.find((obj) => obj.id === locationId).name;

  const locationDataPath = path.join(
    __dirname,
    "..",
    "langchain",
    "docs",
    locationName + ".json"
  );

  const locationData = readFileSync(locationDataPath);
  const locationJsonObject = JSON.parse(locationData);

  let newLessonId = 0;
  let newMinilessonId = 0;
  let newBlockId = (blockId + 1) % 3;

  if (newBlockId === 0) {
    if (lessonId >= locationJsonObject.length - 1) {
      return {
        lessonId: null,
        minilessonId: null,
        blockId: null,
      };
    }

    return {
      lessonId,
      minilessonId,
      blockId: 0,
    };
  }

  locationJsonObject.forEach((lesson, index) => {
    if (index == lessonId) {
      if (minilessonId >= lesson.mini_lessons.length - 1) {
        newLessonId = lessonId + 1;
        newMinilessonId = 0;
      } else {
        newLessonId = minilessonId + 1;
        newMinilessonId = minilessonId;
      }
    }
  });

  return {
    lessonId: newLessonId,
    minilessonId: newMinilessonId,
    blockId: newBlockId,
  };
}

module.exports = {
  getLessonMessageLoremIpsum,
  getWelcomeMessage,
  getLessonMessageAlt,
  getAnswerToUserMessage,
  getLessonsndMiniLessonsName,
  getFreeformMessage,
  getQuestionEvaluation,
};
