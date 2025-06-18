import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');

try {
	if (!fs.existsSync(packageJsonPath)) {
		console.error('package.json not found!');
		process.exit(1);
	}

	const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
	const packageData = JSON.parse(packageJsonContent);

	const currentVersion = packageData.version || '0.0.0';
	let parts = currentVersion.split('.').map(Number);

	// Убедимся, что у нас есть как минимум 3 части (major.minor.patch)
	while (parts.length < 3) {
		parts.push(0);
	}

	parts[2]++; // Инкрементируем патч-версию

	if (parts[2] >= 10) {
		parts[2] = 0;
		parts[1]++;
	}
	if (parts[1] >= 10) {
		parts[2] = 0;
		parts[1] = 0;
		parts[0]++;
	}
	const newVersion = parts.join('.');

	packageData.version = newVersion;

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, '\t')); // '\t' для табов, 2 для 2 пробелов
	console.log(`Version in package.json incremented to: ${newVersion}`);

	// Обновляем переменную окружения для Vite
	process.env.VITE_APP_VERSION = newVersion;
} catch (error) {
	console.error('Failed to increment version:', error);
	process.exit(1);
}
