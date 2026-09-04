const { spawn } = require("child_process");

const cppExecutable =
    "E:/Co-existenceGame/WolfSheepGrass/WolfSheepGrass.exe";

function runSimulation(gameState) {

    return new Promise((resolve, reject) => {

        const cppProcess = spawn(cppExecutable);

        let output = "";
        let errorOutput = "";

        cppProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        cppProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        cppProcess.on("close", (code) => {

            if (code !== 0) {
                return reject(
                    new Error(
                        `C++ process failed: ${errorOutput}`
                    )
                );
            }

            try {
                const result = JSON.parse(output);
                resolve(result);
            }
            catch (error) {
                reject(
                    new Error(
                        `Invalid JSON from C++: ${output}`
                    )
                );
            }
        });

        cppProcess.stdin.write(
            JSON.stringify(gameState)
        );

        cppProcess.stdin.end();
    });
}

module.exports = {
    runSimulation
};