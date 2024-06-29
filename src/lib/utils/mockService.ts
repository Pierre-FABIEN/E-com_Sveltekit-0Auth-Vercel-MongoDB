// mockService.ts
export const fetchMockData = (): Promise<any> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: 'Données simulées' });
		}, 100); // Retard de 1 seconde pour simuler le temps de réponse du serveur
	});
};
