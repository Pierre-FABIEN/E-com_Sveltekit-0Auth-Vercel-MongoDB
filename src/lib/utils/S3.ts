import fs from 'fs';
import path from 'path';

export async function saveImage(file: File): Promise<string> {
	const uploadsDir = path.resolve('uploads');
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir);
	}

	const filePath = path.join(uploadsDir, `${Date.now()}_${file.name}`);
	const arrayBuffer = await file.arrayBuffer();
	fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

	return filePath;
}
