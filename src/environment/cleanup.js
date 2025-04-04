
const cleanupRegister = [];

// ✅ Cleanup function to run before exit
function cleanup() {

    while (cleanupRegister.length > 0)
    {
        console.log('Running Cleanup Register');
        (cleanupRegister.pop())(); // execute the function on the cleanup stack
    }

}

// cleanup on exit: eg. close DB connections, etc.
export function registerCleanupItem(funcToClean)
{
    cleanupRegister.push(funcToClean);
}

export default cleanup;