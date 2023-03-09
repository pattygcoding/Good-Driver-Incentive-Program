
//import the module you are testing
const crypt = require('./encryption.js');

//type npm run test to locally run tests
//When pushing to master branch tests will be run automatically by pipelines

//naming convention: <filename>.test.js

// !! Warning: making empty files with .test. in the name will cause the pipeline
// break.

// Basic tests for encryption
// Describe sigifies a test suite
describe("Encryption Tests", () => {

    //testing hashing function
    //test is a test inside a test suite
    test('Testing hashing', () => {
        
        var clearpass = "password";
        var hashpass = crypt.getHash(clearpass);

        expect(hashpass).not.toBe(clearpass);   //expect is a good way to test
    });

    //testing decryption function
    test('Testing password validation', () => {

        var clearpass = 'test123!'

        var hashpass = crypt.getHash(clearpass)

        var success = crypt.validatePassword('test123!', hashpass);

        expect(success).toBe(true);

        success = crypt.validatePassword('fail123!', hashpass);

        expect(success).not.toBe(true);

    });
});


