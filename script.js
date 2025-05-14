// DOM Elements
const landingPage = document.getElementById('landingPage');
const gamePage = document.getElementById('gamePage');
const testSelectionPage = document.getElementById('testSelectionPage');
const resultsPage = document.getElementById('resultsPage');
const adminDashboard = document.getElementById('adminDashboard');

const startBtn = document.getElementById('startBtn');
const adminBtn = document.getElementById('adminBtn');

const nameModal = document.getElementById('nameModal');
const userName = document.getElementById('userName');
const submitName = document.getElementById('submitName');
const userInfo = document.getElementById('userInfo');
const gameUserInfo = document.getElementById('gameUserInfo');
const resultsUserInfo = document.getElementById('resultsUserInfo');

const testsList = document.getElementById('testsList');
const backToLandingBtn = document.getElementById('backToLandingBtn');
const backToTestsBtn = document.getElementById('backToTestsBtn');

const gameImage = document.getElementById('gameImage');
const passBtn = document.getElementById('passBtn');
const smashBtn = document.getElementById('smashBtn');
const scoreDisplay = document.getElementById('scoreDisplay');

const resultsContainer = document.getElementById('resultsContainer');

const adminLogin = document.getElementById('adminLogin');
const adminUsername = document.getElementById('adminUsername');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const testsContainer = document.getElementById('testsContainer');
const addTestBtn = document.getElementById('addTestBtn');

const testModal = document.getElementById('testModal');
const testModalTitle = document.getElementById('testModalTitle');
const testName = document.getElementById('testName');
const testDescription = document.getElementById('testDescription');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const saveTestBtn = document.getElementById('saveTestBtn');
const cancelTestBtn = document.getElementById('cancelTestBtn');

// Game State
let currentUser = null;
let currentTest = null;
let currentImageIndex = 0;
let smashCount = 0;
let passCount = 0;
let tests = JSON.parse(localStorage.getItem('smashOrPassTests')) || [
    {
        id: 1,
        name: "Celebrities",
        description: "Popular celebrities from around the world",
        images: [
            "https://via.placeholder.com/300/FF0000/FFFFFF?text=Celeb+1",
            "https://via.placeholder.com/300/00FF00/FFFFFF?text=Celeb+2",
            "https://via.placeholder.com/300/0000FF/FFFFFF?text=Celeb+3"
        ],
        totalPlays: 0,
        totalSmashes: 0,
        totalPasses: 0
    },
    {
        id: 2,
        name: "Food",
        description: "Delicious dishes from various cuisines",
        images: [
            "https://via.placeholder.com/300/FF5733/FFFFFF?text=Food+1",
            "https://via.placeholder.com/300/33FF57/FFFFFF?text=Food+2",
            "https://via.placeholder.com/300/3357FF/FFFFFF?text=Food+3"
        ],
        totalPlays: 0,
        totalSmashes: 0,
        totalPasses: 0
    }
];

let currentEditingTest = null;

function init() {
    saveTestsToLocalStorage();
    setupEventListeners();
}

// Save tests to localStorage
function saveTestsToLocalStorage() {
    localStorage.setItem('smashOrPassTests', JSON.stringify(tests));
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', showNameModal);
    adminBtn.addEventListener('click', showAdminLogin);
    
    // Close modals when clicking outside
    nameModal.addEventListener('click', (e) => {
        if (e.target === nameModal) {
            nameModal.style.display = 'none';
        }
    });
    
    adminLogin.addEventListener('click', (e) => {
        if (e.target === adminLogin) {
            adminLogin.style.display = 'none';
        }
    });

    testModal.addEventListener('click', (e) => {
        if (e.target === testModal) {
            testModal.style.display = 'none';
        }
    });
    
    submitName.addEventListener('click', handleNameSubmit);
    backToLandingBtn.addEventListener('click', goBackToLanding);
    backToTestsBtn.addEventListener('click', goBackToTests);
    
    passBtn.addEventListener('click', () => handleChoice('pass'));
    smashBtn.addEventListener('click', () => handleChoice('smash'));
    
    loginBtn.addEventListener('click', handleAdminLogin);
    logoutBtn.addEventListener('click', handleAdminLogout);
    
    addTestBtn.addEventListener('click', showAddTestModal);
    imageUpload.addEventListener('change', handleImageUpload);
    saveTestBtn.addEventListener('click', handleSaveTest);
    cancelTestBtn.addEventListener('click', () => testModal.style.display = 'none');
}

// Show name input modal
function showNameModal() {
    userName.value = '';
    nameModal.style.display = 'flex';
}

// Show admin login
function showAdminLogin() {
    adminLogin.style.display = 'flex';
    adminUsername.value = '';
    adminPassword.value = '';
}

// Handle name submission
function handleNameSubmit() {
    if (userName.value.trim() === '') {
        alert('Please enter your name');
        return;
    }
    
    currentUser = userName.value.trim();
    userInfo.textContent = `Player: ${currentUser}`;
    gameUserInfo.textContent = `Player: ${currentUser}`;
    resultsUserInfo.textContent = `Player: ${currentUser}`;
    
    nameModal.style.display = 'none';
    landingPage.style.display = 'none';
    testSelectionPage.style.display = 'flex';
    
    renderTestSelection();
}

// Render test selection
function renderTestSelection() {
    testsList.innerHTML = '';
    
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <h3>${test.name}</h3>
            <p>${test.description}</p>
            <p class="test-stats">Plays: ${test.totalPlays} | Smash: ${test.totalSmashes} | Pass: ${test.totalPasses}</p>
        `;
        testCard.addEventListener('click', () => startTest(test));
        testsList.appendChild(testCard);
    });
}

// Start a test
function startTest(test) {
    currentTest = test;
    currentImageIndex = 0;
    smashCount = 0;
    passCount = 0;
    
    testSelectionPage.style.display = 'none';
    gamePage.style.display = 'flex';
    
    updateScoreDisplay();
    gameImage.src = test.images[currentImageIndex];
}

// Handle user choice (smash or pass)
function handleChoice(choice) {
    if (choice === 'smash') {
        smashCount++;
    } else {
        passCount++;
    }
    
    currentImageIndex++;
    updateScoreDisplay();
    
    if (currentImageIndex < currentTest.images.length) {
        gameImage.src = currentTest.images[currentImageIndex];
    } else {
        endTest();
    }
}

// Update score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Smash: ${smashCount} | Pass: ${passCount}`;
}

// End the current test
function endTest() {
    // Update test statistics
    const testIndex = tests.findIndex(t => t.id === currentTest.id);
    if (testIndex !== -1) {
        tests[testIndex].totalPlays++;
        tests[testIndex].totalSmashes += smashCount;
        tests[testIndex].totalPasses += passCount;
        saveTestsToLocalStorage();
    }
    
    // Show results
    gamePage.style.display = 'none';
    resultsPage.style.display = 'flex';
    
    renderResults();
}

// Render results
function renderResults() {
    resultsContainer.innerHTML = `
        <div class="result-stat">
            <span class="label">Test:</span>
            <span class="value">${currentTest.name}</span>
        </div>
        <div class="result-stat">
            <span class="label">Total Images:</span>
            <span class="value">${currentTest.images.length}</span>
        </div>
        <div class="result-stat">
            <span class="label">Smashes:</span>
            <span class="value">${smashCount} (${Math.round((smashCount / currentTest.images.length) * 100)}%)</span>
        </div>
        <div class="result-stat">
            <span class="label">Passes:</span>
            <span class="value">${passCount} (${Math.round((passCount / currentTest.images.length) * 100)}%)</span>
        </div>
    `;
}

// Navigate back to landing page
function goBackToLanding() {
    testSelectionPage.style.display = 'none';
    landingPage.style.display = 'flex';
}

// Navigate back to test selection
function goBackToTests() {
    resultsPage.style.display = 'none';
    testSelectionPage.style.display = 'flex';
}

// Handle admin login
function handleAdminLogin() {
    // Simple admin login (in a real app, this would be more secure)
    if (adminUsername.value === 'admin' && adminPassword.value === 'admin123') {
        adminLogin.style.display = 'none';
        landingPage.style.display = 'none';
        adminDashboard.style.display = 'block';
        renderAdminTests();
    } else {
        alert('Invalid username or password');
    }
}

// Handle admin logout
function handleAdminLogout() {
    adminDashboard.style.display = 'none';
    landingPage.style.display = 'flex';
}

// Render admin tests
function renderAdminTests() {
    testsContainer.innerHTML = '';
    
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <h3>${test.name}</h3>
            <p>${test.description}</p>
            <p>Images: ${test.images.length}</p>
            <p>Plays: ${test.totalPlays} | Smash: ${test.totalSmashes} | Pass: ${test.totalPasses}</p>
            <div class="test-actions">
                <button class="edit-btn" data-id="${test.id}">Edit</button>
                <button class="delete-btn" data-id="${test.id}">Delete</button>
            </div>
        `;
        testsContainer.appendChild(testCard);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = parseInt(e.target.getAttribute('data-id'));
            editTest(testId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = parseInt(e.target.getAttribute('data-id'));
            deleteTest(testId);
        });
    });
}

// Show add test modal
function showAddTestModal() {
    currentEditingTest = null;
    testModalTitle.textContent = 'Add New Test';
    testName.value = '';
    testDescription.value = '';
    imagePreview.innerHTML = '';
    testModal.style.display = 'flex';
}

// Handle image upload
function handleImageUpload(e) {
    const files = e.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const imgElement = document.createElement('div');
            imgElement.className = 'image-preview-item';
            imgElement.innerHTML = `
                <img src="${event.target.result}" alt="Preview">
                <div class="remove-image">×</div>
            `;
            imagePreview.appendChild(imgElement);
            
            // Add click handler to remove button
            imgElement.querySelector('.remove-image').addEventListener('click', () => {
                imgElement.remove();
            });
        };
        
        reader.readAsDataURL(file);
    }
}

// Edit a test
function editTest(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    
    currentEditingTest = test;
    testModalTitle.textContent = 'Edit Test';
    testName.value = test.name;
    testDescription.value = test.description;
    imagePreview.innerHTML = '';
    
    test.images.forEach(img => {
        const imgElement = document.createElement('div');
        imgElement.className = 'image-preview-item';
        imgElement.innerHTML = `
            <img src="${img}" alt="Preview">
            <div class="remove-image">×</div>
        `;
        imagePreview.appendChild(imgElement);
        
        // Add click handler to remove button
        imgElement.querySelector('.remove-image').addEventListener('click', () => {
            imgElement.remove();
        });
    });
    
    testModal.style.display = 'flex';
}

// Delete a test
function deleteTest(testId) {
    if (confirm('Are you sure you want to delete this test?')) {
        tests = tests.filter(t => t.id !== testId);
        saveTestsToLocalStorage();
        renderAdminTests();
    }
}

// Handle save test - FIXED VERSION
function handleSaveTest() {
    if (testName.value.trim() === '') {
        alert('Please enter a test name');
        return;
    }
    
    const images = [];
    const previewItems = imagePreview.querySelectorAll('.image-preview-item img');
    previewItems.forEach(item => {
        // Check if it's a data URL (new upload) or existing URL
        if (item.src.startsWith('data:')) {
            images.push(item.src);
        } else {
            // For existing images that weren't changed
            images.push(item.src);
        }
    });
    
    if (images.length === 0) {
        alert('Please add at least one image');
        return;
    }
    
    if (currentEditingTest) {
        // Update existing test
        const testIndex = tests.findIndex(t => t.id === currentEditingTest.id);
        if (testIndex !== -1) {
            tests[testIndex] = {
                ...tests[testIndex],
                name: testName.value.trim(),
                description: testDescription.value.trim(),
                images: images,
                // Preserve existing stats
                totalPlays: tests[testIndex].totalPlays,
                totalSmashes: tests[testIndex].totalSmashes,
                totalPasses: tests[testIndex].totalPasses
            };
        }
    } else {
        // Add new test
        const newTest = {
            id: tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1,
            name: testName.value.trim(),
            description: testDescription.value.trim(),
            images: images,
            totalPlays: 0,
            totalSmashes: 0,
            totalPasses: 0
        };
        tests.push(newTest);
    }
    
    saveTestsToLocalStorage();
    testModal.style.display = 'none';
    renderAdminTests();
}
// Initialize the app
init();