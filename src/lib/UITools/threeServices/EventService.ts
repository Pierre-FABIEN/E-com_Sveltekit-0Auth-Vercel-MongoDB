class EventService {
	private eventCallbacks: Record<string, ((event: Event) => void)[]> = {};

	public on(eventType: string, callback: (event: Event) => void) {
		if (!this.eventCallbacks[eventType]) {
			this.eventCallbacks[eventType] = [];
		}
		this.eventCallbacks[eventType].push(callback);
	}

	public off(eventType: string, callback: (event: Event) => void) {
		const callbacks = this.eventCallbacks[eventType];
		if (!callbacks) return;
		const index = callbacks.indexOf(callback);
		if (index > -1) {
			callbacks.splice(index, 1);
		}
	}

	public trigger(eventType: string, event: Event) {
		const callbacks = this.eventCallbacks[eventType];
		if (!callbacks) return;
		callbacks.forEach((callback) => callback(event));
	}
}

export const eventService = new EventService();
