import { readFile } from 'fs/promises';
import path from 'path';
import testInitialize from "../initialize.js";
import createLesson from "../../../src/controller/createLesson.js";

/* This build a test json file for the lesson object. */

async function testCreateLesson()
{
    console.log(`Start Create Lesson Test`);
    await testInitialize();
    try {
        // get our test data
        const data = await readFile(path.resolve('public/json/testData.json'), 'utf8');
        const lesson = JSON.parse(data);
        createLesson(lesson)
    }
    catch (error) {
        console.log(`testCreateLesson: ${error}`);
    }

}

testCreateLesson();