const token = '6dITi7vSlWRj6aUOTzgWMSixg4VMrVoJrDwnRTLP';
const groupId = '102743257';

// Fetch messages from GroupMe API
async function fetchMessages() {
    const response = await fetch(`https://api.groupme.com/v3/groups/${groupId}/messages?token=${token}`);
    const data = await response.json();
    const messages = data.response.messages;

    // Object to store images by sender
    const senderImages = {};

    // Loop through the messages and extract image attachments
    messages.forEach(msg => {
        const senderName = msg.name;

        // Check for image attachments
        msg.attachments.forEach(attachment => {
            if (attachment.type === 'image') {
                if (!senderImages[senderName]) {
                    senderImages[senderName] = [];
                }
                // Store the image URL under the sender's name
                senderImages[senderName].push(attachment.url);
            }
        });
    });

    // Insert the data into the HTML table
    const tableBody = document.getElementById('tableBody');
    Object.keys(senderImages).forEach(sender => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = sender;

        const imageCell = document.createElement('td');
        senderImages[sender].forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100px'; // Set image size
            imageCell.appendChild(img);
        });

        row.appendChild(nameCell);
        row.appendChild(imageCell);
        tableBody.appendChild(row);
    });
}

// Call the function to fetch and display messages
fetchMessages();
