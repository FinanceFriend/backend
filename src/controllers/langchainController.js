const { spawn } = require('child_process');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'langchain', 'scripts', 'script.py');


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
        const { lesson_index, mini_lesson_index } = req.body;
        const result = await executePython(scriptPath, [lesson_index, mini_lesson_index]);
  
        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error });
    }
  };

module.exports = {
    getLessonMessage,
};