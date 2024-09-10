const token = '6dITi7vSlWRj6aUOTzgWMSixg4VMrVoJrDwnRTLP';
const groupId = '102743257';
const messageLimit = 100;
let oldestMessageId = null;
const senderImages = {
    week1: {},
    week2: {},
    week3: {}
};

// Date ranges for weeks
const week1Start = new Date('2024-08-27').getTime() / 1000; // Unix timestamp in seconds
const week1End = new Date('2024-08-28 23:59:59').getTime() / 1000;
const week2Start = new Date('2024-09-03').getTime() / 1000;
const week2End = new Date('2024-09-04 23:59:59').getTime() / 1000;
const week3Start = new Date('2024-09-10').getTime() / 1000;
const week3End = new Date('2024-09-11 23:59:59').getTime() / 1000;

// Fetch messages from GroupMe API with pagination
async function fetchMessages(beforeId = null) {
    let url = `https://api.groupme.com/v3/groups/${groupId}/messages?token=${token}&limit=${messageLimit}`;
    if (beforeId) {
        url += `&before_id=${beforeId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const messages = data.response.messages;

    if (messages.length > 0) {
        oldestMessageId = messages[messages.length - 1].id;

        messages.forEach(msg => {
            const senderName = msg.name;
            const messageTime = msg.created_at;

            // Check for image attachments and categorize them by date range
            msg.attachments.forEach(attachment => {
                if (attachment.type === 'image') {
                    let targetWeek = null;

                    if (messageTime >= week1Start && messageTime <= week1End) {
                        targetWeek = 'week1';
                    } else if (messageTime >= week2Start && messageTime <= week2End) {
                        targetWeek = 'week2';
                    } else if (messageTime >= week3Start && messageTime <= week3End) {
                        targetWeek = 'week3';
                    }

                    if (targetWeek) {
                        if (!senderImages[targetWeek][senderName]) {
                            senderImages[targetWeek][senderName] = [];
                        }
                        senderImages[targetWeek][senderName].push(attachment.url);
                    }
                }
            });
        });

        // Insert the data into the HTML table
        renderTable();

        // Fetch the next batch of messages if available
        await fetchMessages(oldestMessageId);
    }
}

// Function to render the table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear the existing table body before re-rendering

    // Get all unique senders
    const allSenders = new Set([...Object.keys(senderImages.week1), ...Object.keys(senderImages.week2), ...Object.keys(senderImages.week3)]);

    allSenders.forEach(sender => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = sender;
        row.appendChild(nameCell);

        // Create cells for week 1, week 2, and week 3
        const week1Cell = createImageCell(senderImages.week1[sender]);
        const week2Cell = createImageCell(senderImages.week2[sender]);
        const week3Cell = createImageCell(senderImages.week3[sender]);

        row.appendChild(week1Cell);
        row.appendChild(week2Cell);
        row.appendChild(week3Cell);

        tableBody.appendChild(row);
    });
}

// Helper function to create image cell
function createImageCell(images) {
    const cell = document.createElement('td');
    if (images) {
        images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100px'; // Set image size
            cell.appendChild(img);
        });
    }
    return cell;
}

// Call the function to fetch and display messages
fetchMessages();
