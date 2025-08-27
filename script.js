document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const spinner = document.getElementById('spinner');

    form.addEventListener('submit', handleFormSubmit);

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Clear previous messages
        messageDiv.textContent = '';
        messageDiv.className = 'message';
        
        // Show loading state
        setLoadingState(true);
        
        try {
            const formData = new FormData(form);
            
            // Validate file size (10MB limit)
            const fileInput = document.getElementById('file');
            const file = fileInput.files[0];
            if (file && file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB');
            }
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showMessage('File uploaded successfully!', 'success');
                form.reset();
            } else {
                throw new Error(result.error || 'Upload failed');
            }
            
        } catch (error) {
            console.error('Upload error:', error);
            showMessage('Error: ' + error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    }
    
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitText.textContent = 'Uploading...';
            spinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'Upload';
            spinner.classList.add('hidden');
        }
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
    
    // File input change handler for better UX
    document.getElementById('file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showMessage('File size must be less than 10MB', 'error');
                e.target.value = '';
            } else {
                showMessage(`Selected: ${file.name} (${formatFileSize(file.size)})`, 'info');
            }
        }
    });
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});

