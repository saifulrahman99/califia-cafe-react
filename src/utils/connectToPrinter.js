export function connectToPrinter({setDevice}) {
    const connectPrinter = async () => {
        try {
            const dev = await navigator.usb.requestDevice({
                filters: [{vendorId: 0x04b8}], // Sesuaikan dengan vendor printer
            });
            await dev.open();
            if (!dev.configuration) await dev.selectConfiguration(1);
            await dev.claimInterface(0);
            setDevice(dev);
            return true;
        } catch {
            return false;
        }
    }
    return connectPrinter();
}