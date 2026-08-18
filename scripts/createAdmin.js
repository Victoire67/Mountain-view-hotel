// scripts/createAdm
import dotenv from "dotenv"
dotenv.config();
import  Readline from "readline";
import bcrypt from "bcrypt"
import pool from "../server/src/config/db.js" // Your NeonDB connection pool

// Helper to prompt terminal input with hidden password support
function promptInput(query, isPassword = false) {
    return new Promise((resolve) => {
        const rl = Readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        if (!isPassword) {
            rl.question(query, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        } else {
            // Mask password typing with asterisks
            process.stdout.write(query);
            let password = '';
            
            process.stdin.setRawMode(true);
            process.stdin.resume();
            
            const onData = (char) => {
                char = char.toString('utf8');
                switch (char) {
                    case '\n':
                    case '\r':
                    case '\u0004': // Ctrl+D
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        process.stdin.removeListener('data', onData);
                        rl.close();
                        console.log(); // Newline
                        resolve(password);
                        break;
                    case '\u0003': // Ctrl+C
                        process.exit();
                        break;
                    case '\u007f': // Backspace
                    case '\b':
                        if (password.length > 0) {
                            password = password.slice(0, -1);
                            process.stdout.write('\b \b');
                        }
                        break;
                    default:
                        password += char;
                        process.stdout.write('*');
                        break;
                }
            };

            process.stdin.on('data', onData);
        }
    });
}

async function runAdminCLI() {
    console.log('\n========================================');
    console.log('       CREATE ADMIN USER SCRIPT        ');
    console.log('========================================\n');

    try {
        // 1. Prompt Email
        const email = await promptInput('Enter Email Address: ');
        if (!email || !email.includes('@')) {
            console.log('\n❌ USER NOT CREATED: Invalid email format.');
            process.exit(1);
        }

        // 2. Prompt Password
        const password = await promptInput('Enter Password: ', true);
        if (!password || password.length < 6) {
            console.log('\n❌ USER NOT CREATED: Password must be at least 6 characters.');
            process.exit(1);
        }

        // 3. Prompt Password Confirmation
        const confirmPassword = await promptInput('Confirm Password: ', true);

        // 4. Validate matching passwords
        if (password !== confirmPassword) {
            console.log('\n❌ USER NOT CREATED: Passwords do not match.');
            process.exit(1);
        }

        // 5. Check if user already exists in NeonDB
        const checkUser = await pool.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1)', 
            [email]
        );

        if (checkUser.rows.length > 0) {
            console.log(`\n❌ USER NOT CREATED: A user with email "${email}" already exists.`);
            process.exit(1);
        }

        // 6. Hash password & Insert into database
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const insertQuery = `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email;
        `;

        await pool.query(insertQuery, [
            email.toLowerCase(), 
            passwordHash
        ]);

        console.log('\n✅ USER SUCCESSFULLY CREATED');
        console.log(`Account registered for: ${email}\n`);

    } catch (err) {
        console.log("MAMAEEEE")
        console.log('\n❌ USER NOT CREATED: Database error - ' + err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

runAdminCLI();