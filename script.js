const token = '6dITi7vSlWRj6aUOTzgWMSixg4VMrVoJrDwnRTLP';
const groupId = '102743257';

// Fetch messages from GroupMe API
async function fetchMessages() {
    const response = await fetch(`https://api.groupme.com/v3/groups/${groupId}/messages?token=${token}`);
    const data = await response.json();
    const messages = data.response.messages;

    // Find messages with images
    const imageMessages = messages.filter(msg => msg.attachments.length > 0 && msg.attachments[0].type === 'image');

    // Insert data into the HTML table
    const tableBody = document.getElementById('tableBody');
    imageMessages.forEach(msg => {
        const name = msg.name;
        const imageUrl = msg.attachments[0].url;

        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = name;

        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100px';
        imageCell.appendChild(img);

        row.appendChild(nameCell);
        row.appendChild(imageCell);
        tableBody.appendChild(row);
    });
}

fetchMessages();