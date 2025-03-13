
const cleanupRegister = [];

// ✅ Cleanup function to run before exit
function cleanup() {

    while (cleanupRegister.length > 0)
    {
        (cleanupRegister.pop())();
    }

}

export function registerCleanupItem(funcToClean)
{
    cleanupRegister.push(funcToClean);
}

export default cleanup;