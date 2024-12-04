import { EventBus } from '@/eventBus';

export function openCloudinaryWidget(onSuccessCallback) {
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: 'dobbqxx6w',
            uploadPreset: 'samyangUploads',
            sources: ['local', 'url'],
            maxFileSize: 5 * 1024 * 1024, // 5 MB
            clientAllowedFormats: ['jpg', 'png'],
            cropping: true,
        },
        (error, result) => {
            if (error) {
                console.error('Cloudinary error:', error);
                EventBus.$emit('message', { type: 'error', text: 'Failed to upload photo.' });
            } else if (result.event === 'success') {
                onSuccessCallback(result.info);
                EventBus.$emit('message', { type: 'success', text: 'Photo uploaded successfully!' });
            }
        }
    );
    widget.open();
}
