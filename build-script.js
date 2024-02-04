import { execSync } from "child_process";
import readlineSync from "readline-sync";
import fs from "fs";

// Define project-related directories
const rootDirectory = "/root";
const projectDirectory = "/root/ITSM-3.0/";
const frontendDirectory = "/root/ITSM-3.0/frontend";
const backendDirectory = "/root/ITSM-3.0/backend";
const envDirectory = "/root/env-file";

// Define npm and pip commands
const installCommand = "npm install";
const buildCommand = "npm run build";
const installRequirements = "pip install -r requirements.txt";

// Define pm2 commands
const pm2Status = "pm2 status";
const pm2Delete = "pm2 delete all";
const pm2Save = "pm2 save";
const pm2StartFrontend = "pm2 serve --spa dist 3000";
const pm2StartBackend = "pm2 start runscript.json";

// Define project version and current date
const projectVersion = "3.0";
const currentDate = new Date();
const formattedDate = `${(currentDate.getMonth() + 1)
  .getDate()
  .toString()
  .padStart(2, "0")}.${currentDate
  .toString()
  .padStart(2, "0")}.${currentDate.getFullYear()}`;

// Define migration files deletion command
const resetMigration = "python3 reset_migrations.py";

// Define seed data command
const seedData = " python3 add_fake_data.py";

// Define env-file copy command
const copyEnvFile = "cp .env " + backendDirectory;

/* Function to run a command in a directory */
function runCommandInDirectory(command, directory) {
  try {
    console.log(`Running "${command}" in directory "${directory}"...`);
    execSync(command, { cwd: directory, stdio: "inherit" });
    console.log(
      `"${command}" completed successfully in directory "${directory}".`
    );
  } catch (error) {
    console.error(
      `An error occurred while running "${command}" in directory "${directory}":`,
      error.message
    );
    // Exit the script with an error code
    process.exit(1);
  }
}

/* Function to check if a directory exists */
function directoryExists(path) {
  try {
    return fs.existsSync(path);
  } catch (error) {
    return false;
  }
}

/* ========== Running Commands ========== */

// Check pm2 status
runCommandInDirectory(pm2Status, rootDirectory);

// Ask if the user wants to insert PM2 IDs
let insertPM2IDs;
do {
  insertPM2IDs = readlineSync.keyInYNStrict(
    "Do you want to insert PM2 IDs? (y/n): "
  );
} while (insertPM2IDs !== true && insertPM2IDs !== false);

if (insertPM2IDs) {
  // Get backend PM2 ID
  let backendID;
  do {
    backendID = readlineSync.questionInt(
      "Enter backend PM2 ID (must be a number greater than or equal to zero): "
    );
  } while (!(backendID >= 0));

  // Get frontend PM2 ID
  let frontendID;
  do {
    frontendID = readlineSync.questionInt(
      "Enter frontend PM2 ID (must be a number greater than or equal to zero): "
    );
  } while (!(frontendID >= 0));

  // Generate pm2stop command
  const pm2Stop = `pm2 stop ${backendID} && pm2 stop ${frontendID}`;

  // Stop pm2 processes
  runCommandInDirectory(pm2Stop, rootDirectory);
  console.log("pm2 stopped");
} else {
  // Abort mission
  console.log("Aborting mission: PM2 IDs required.");
  process.exit(0); // Exit with success code
}

// Stop pm2 processes
// runCommandInDirectory(pm2Stop, rootDirectory);

if (directoryExists(projectDirectory)) {
  // Rename project directory with the current date
  runCommandInDirectory(
    `mv ITSM-"${projectVersion}" ITSM-"${projectVersion}"-"${formattedDate}"`,
    rootDirectory
  );
} else {
  console.log("Aborting mission: File does not exists.");
  process.exit(0); // Exit with success code
}

/**
 * Define git clone command with a Personal Access Token (PAT)
 * Example: "git clone -b staging https://<PAT>@github.com/bitprojectspace/ITSM-3.0.git";
 */
//git clone -b staging https://github.com/bitprojectspace/ITSM-3.0.git
//git clone -b staging https://github.com/bitprojectspace/ITSM-3.0.git
let gitClone;

do {
  // example command should be shown here
  const userEnteredGitClone = readlineSync.question(
    "Enter the Git clone command: "
  );

  if (userEnteredGitClone.trim() === "") {
    console.log("Please enter a valid command.");
  } else {
    // Use the user-entered command
    gitClone = userEnteredGitClone;
  }
} while (!gitClone);

// Clone the repository
runCommandInDirectory(gitClone, rootDirectory);

// Copy the env file
runCommandInDirectory(copyEnvFile, envDirectory);

// Frontend build
runCommandInDirectory(installCommand, frontendDirectory);
runCommandInDirectory(buildCommand, frontendDirectory);
console.log("Frontend build process completed successfully.");

// Backend build
runCommandInDirectory(installRequirements, backendDirectory);
runCommandInDirectory(resetMigration, backendDirectory);
runCommandInDirectory(seedData, backendDirectory);
console.log("Backend build process completed successfully.");

// Start pm2 processes
runCommandInDirectory(pm2Delete, projectDirectory);
runCommandInDirectory(pm2StartBackend, backendDirectory);
runCommandInDirectory(pm2StartFrontend, frontendDirectory);
runCommandInDirectory(pm2Save, projectDirectory);

// Build Process Complete
console.log("Build Process Is Done!!!!!");
