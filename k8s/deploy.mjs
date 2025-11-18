// deploy.mjs
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const rootDir = new URL('.', import.meta.url).pathname; // thư mục hiện tại
const services = readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const service of services) {
    const servicePath = join(rootDir, service);

    // Kiểm tra service.mjs có tồn tại không
    const serviceFile = join(servicePath, "service.mjs");
    try {
        statSync(serviceFile);
    } catch (err) {
        console.log(`Skipping ${service}, no service.mjs found`);
        continue;
    }

    console.log(`\n🚀 Deploying ${service}...`);
    try {
        // Chạy service.mjs bằng node
        execSync(`zx service.mjs apply`, { stdio: "inherit", cwd: servicePath });
    } catch (err) {
        console.error(`❌ Error deploying ${service}:`, err.message);
    }
}
