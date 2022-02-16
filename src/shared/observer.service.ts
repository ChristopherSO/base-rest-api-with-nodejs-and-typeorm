export enum ObserverEvent {
	ConnectionIsReady,
	Other,
}

class ObserverService {
	private _subscriptionNumber = 0;
	private _subscriptions = new Map<number, [ObserverEvent, Function, boolean?]>();

	subscribe({ event, callback, useOnce }: {
		event: ObserverEvent,
		callback: Function,
		useOnce?: boolean
	}) {
		const subscriptionNumber = ++this._subscriptionNumber;
		this._subscriptions.set(subscriptionNumber, [event, callback, useOnce]);
	}

	notify(event: ObserverEvent) {
		this._subscriptions.forEach(([subscriptionEvent, callback, useOnce], subscriptionNumber) => {
			if (subscriptionEvent === event) {
				callback();
				if (useOnce) {
					this._subscriptions.delete(subscriptionNumber);
				}
			}
		});
	}
}

export const observerService = new ObserverService();
