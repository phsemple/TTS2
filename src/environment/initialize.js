import cleanup from './cleanup.js'


// define exit event behavior.
export default function initializeEnviroment()
{ 
    setExitConditions();
}

// set the exit event handlers.
function setExitConditions()
{
    process.on('exit', cleanup);

    // ✅ Capture termination signals
    process.on('SIGINT', () => { console.log('SIGINT received'); cleanup(); process.exit(130); });
    process.on('SIGTERM', () => { console.log('SIGTERM received'); cleanup(); process.exit(143); });

    // ✅ Capture uncaught exceptions (prevent process crash)
    process.on('uncaughtException', (error) => {
        console.error(' Uncaught Exception:', error);
        cleanup();
        process.exit(1); // Exit with error code
    });

    process.on("unhandledRejection", (reason, promise) => {
    console.error("🚨 Unhandled Promise Rejection:");
    console.error("Reason:", reason);
    console.error("Promise:", promise);
    }); 
}
