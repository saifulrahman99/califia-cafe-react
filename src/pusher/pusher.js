import Pusher from "pusher-js";

const appKey = import.meta.env.VITE_PUSHER_KEY;
const cluster = import.meta.env.VITE_PUSHER_CLUSTER;
// Inisialisasi Pusher
const pusher = new Pusher(appKey, {
    cluster: cluster,
    encrypted: true,
});

// Fungsi untuk subscribe ke channel
export const subscribeToChannel = (channelName, eventName, callback) => {
    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
        channel.unbind(eventName, callback);
        pusher.unsubscribe(channelName);
    };
};

export default pusher;