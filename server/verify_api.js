const testAdminAPI = async () => {
    const timeout = 5000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        console.log('1. Attempting login to https://skills-hub-app.vercel.app/api/auth/login ...');
        const loginResponse = await fetch('https://skills-hub-app.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'ankitkumar2431967@gmail.com',
                password: 'ankit123'
            }),
            signal: controller.signal
        });

        clearTimeout(id);

        console.log('Login Status:', loginResponse.status);
        const loginData = await loginResponse.json();
        console.log('Login Body:', JSON.stringify(loginData, null, 2));

        if (loginData.success) {
            const token = loginData.token;

            console.log('2. Attempting to fetch users from https://skills-hub-app.vercel.app/api/users ...');
            const usersResponse = await fetch('https://skills-hub-app.vercel.app/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Users Status:', usersResponse.status);
            const usersData = await usersResponse.json();
            console.log('Users Body:', JSON.stringify(usersData, null, 2));

        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
};

testAdminAPI();
