const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log("Starting verification for new fields and edit feature...");

    // 1. Create with new fields
    const newComm = {
        name: "Test Update Community",
        platform: "WhatsApp",
        link: "http://example.com",
        tags: {
            country: "USA",
            field: "CS",
            courseType: "Masters",
            sourceCountry: "India", // NEW
            university: "MIT",      // NEW
            intake: "Fall 2025"     // NEW
        }
    };

    console.log("1. Creating community with new fields...");
    const createRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/communities',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, newComm);

    if (createRes.status !== 200) {
        console.error("Create failed", createRes.body);
        return;
    }

    const createdId = createRes.body.data.id;
    console.log("Created ID:", createdId);
    console.log("Source Country:", createRes.body.data.tags.sourceCountry);

    if (createRes.body.data.tags.sourceCountry !== "India") {
        console.error("FAILED: Source country not saved correctly");
    }

    // 2. Update (PUT)
    console.log("\n2. Updating community...");
    const updatePayload = {
        ...newComm,
        name: "Updated Name",
        tags: {
            ...newComm.tags,
            sourceCountry: "Brazil",
            intake: "Spring 2026"
        }
    };

    const updateRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/communities/${createdId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }, updatePayload);

    console.log("Update Status:", updateRes.status);
    console.log("Updated Source Country:", updateRes.body.data.tags.sourceCountry);

    if (updateRes.body.data.tags.sourceCountry !== "Brazil") {
        console.error("FAILED: Update did not persist new value");
    }

    // 3. Clean up
    console.log("\n3. Deleting test community...");
    await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/communities/${createdId}`,
        method: 'DELETE'
    });

    console.log("Verification complete.");
}

runTests();
