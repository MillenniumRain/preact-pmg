import { ENVIRONMENT } from './environment';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';
import vitePluginSftp from 'vite-plugin-sftp';
import dotenv from 'dotenv';
dotenv.config();
// Функция для чтения версии из package.json
function getAppVersion() {
	const packageJsonPath = path.resolve(process.cwd(), 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
		return packageJson.version || 'unknown';
	}
	return 'unknown';
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		tailwindcss(),
		{
			name: 'html-transform-version-comment',
			transformIndexHtml(html) {
				const appVersion = getAppVersion();
				return `<!-- PMG Version: ${appVersion} -->\n${html}`;
			},
		},
		viteSingleFile(),
		vitePluginSftp({
			host: ENVIRONMENT.host,
			port: Number(ENVIRONMENT.port) || 22, // Преобразуем в число, с дефолтом 22
			username: ENVIRONMENT.username,
			password: ENVIRONMENT.password,
			path: path.resolve(__dirname, 'dist'),
			remotePath: ENVIRONMENT.remotePath || '',
			oldRemotePath: ENVIRONMENT.oldRemotePath,
		}),
	],
});
