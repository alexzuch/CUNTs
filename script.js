const token = '6dITi7vSlWRj6aUOTzgWMSixg4VMrVoJrDwnRTLP';
const groupId = '102743257';

// Helper function to get week number based on a date
function getWeekNumber(d) {
    const start = new Date(d.getFullYear(), 0, 1); // Start of the year
    const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)); // Divide by milliseconds in a week
}

// Fetch messages from GroupMe API
async function fetchMessages() {
    const response = await fetch(`https://api.groupme.com/v3/groups/${groupId}/messages?token=${token}`);
    const data = await response.json();
    const messages = data.response.messages;

    // Object to store images by sender and week
    const senderImages = {};
    const weeks = new Set(); // To track week numbers for table columns

    // Loop through the messages and extract image attachments from Tuesdays and Wednesdays
    messages.forEach(msg => {
        const timestamp = new Date(msg.created_at * 1000); // Convert to JavaScript Date
        const dayOfWeek = timestamp.getDay(); // Get the day of the week (0: Sunday, 1: Monday, ..., 6: Saturday)
        const weekNumber = getWeekNumber(timestamp); // Get the week number
        weeks.add(weekNumber); // Track which weeks are present

        // Only process messages sent on Tuesday (2) or Wednesday (3)
        if (dayOfWeek === 2 || dayOfWeek === 3) {
            const senderName = msg.name;

            // Loop through the attachments to find images
            msg.attachments.forEach(attachment => {
                if (attachment.type === 'image') {
                    if (!senderImages[senderName]) {
                        senderImages[senderName] = {};
                    }
                    if (!senderImages[senderName][weekNumber]) {
                        senderImages[senderName][weekNumber] = [];
                    }
                    // Store the image URL under the sender's name and week number
                    senderImages[senderName][weekNumber].push(attachment.url);
                }
            });
        }
    });

    // Sort weeks in ascending order for table column generation
    const sortedWeeks = Array.from(weeks).sort((a, b) => a - b);

    // Insert the data into the HTML table
    const tableBody = document.getElementById('tableBody');
    const tableHead = document.getElementById('tableHead');

    // Create the table header (Week 1, Week 2, ...)
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Empty header for sender names
    sortedWeeks.forEach(weekNumber => {
        const th = document.createElement('th');
        th.textContent = `Week ${weekNumber}`;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create table rows for each sender
    Object.keys(senderImages).forEach(sender => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = sender;
        row.appendChild(nameCell);

        // Fill the row with images for each week
        sortedWeeks.forEach(weekNumber => {
            const imageCell = document.createElement('td');
            if (senderImages[sender][weekNumber]) {
                senderImages[sender][weekNumber].forEach(imageUrl => {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.style.maxWidth = '100px'; // Set image size
                    imageCell.appendChild(img);
                });
            }
            row.appendChild(imageCell);
        });

        tableBody.appendChild(row);
    });
}

// Call the function to fetch and display messages
fetchMessages();
