<?php
// groups.php: Handles group creation
header('Content-Type: application/json');

// If the request is POST → handle group creation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $groupsFile = __DIR__ . '/../data/groups.json';
    if (!file_exists($groupsFile)) {
        file_put_contents($groupsFile, json_encode([]));
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $groupName = trim($data['groupName'] ?? '');
    $creator   = trim($data['creator'] ?? '');

    if ($groupName === '') {
        echo json_encode(['success' => false, 'message' => 'Group name required.']);
        exit;
    }

    $groups = json_decode(file_get_contents($groupsFile), true);
    foreach ($groups as $g) {
        if (strtolower($g['name']) === strtolower($groupName)) {
            echo json_encode(['success' => false, 'message' => 'Group name already exists.']);
            exit;
        }
    }

    $newGroup = [
        'name'    => $groupName,
        'creator' => $creator,
        'members' => [$creator],
        'created' => date('Y-m-d H:i:s')
    ];

    $groups[] = $newGroup;
    file_put_contents($groupsFile, json_encode($groups, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'message' => 'Group created!', 'group' => $newGroup]);
    exit;
}

// If not POST → serve the HTML page
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study Groups</title>
    <link rel="stylesheet" href="../styling/studygroup.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <style>
        body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial; background: #f3f4f6; color: #222; }
        .group-list { max-width: 700px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #e5e7eb; padding: 32px; }
        .group-card { background: #e0e7ff; border-radius: 8px; padding: 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .btn { border: none; border-radius: 6px; padding: 8px 14px; cursor: pointer; background: #6366f1; color: #fff; }
        .form-row { display: flex; gap: 10px; margin-bottom: 18px; }
    </style>
</head>
<body>
<div class="group-list">
    <h2 style="color:#4f46e5; margin-bottom:18px;">Study Groups</h2>
    <div class="form-row">
        <input id="newGroupName" type="text" placeholder="New group name" style="flex:1; padding:8px; border-radius:6px; border:1px solid #e0e7ff;" />
        <button id="createGroupBtn" class="btn">Create Group</button>
    </div>
    <div id="groupsContainer"></div>
</div>

<script>
// Use localStorage for demo persistence
function getGroups() {
    return JSON.parse(localStorage.getItem('studyGroups') || '[]');
}
function saveGroups(groups) {
    localStorage.setItem('studyGroups', JSON.stringify(groups));
}
function renderGroups() {
    const groups = getGroups();
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';
    if (groups.length === 0) {
        container.innerHTML = '<div style="color:#888;">No groups yet. Create one above!</div>';
        return;
    }
    groups.forEach(g => {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.innerHTML = `<div><b>${g}</b></div><button class='btn' onclick='joinGroup("${g}")'>Join</button>`;
        container.appendChild(card);
    });
}
function joinGroup(name) {
    // Navigate to groupdetails.php with group name
    window.location.href = `groupdetails.php?group=${encodeURIComponent(name)}`;
}
document.getElementById('createGroupBtn').onclick = function() {
    const name = document.getElementById('newGroupName').value.trim();
    if (!name) { alert('Enter a group name'); return; }
    let groups = getGroups();
    if (groups.includes(name)) { alert('Group already exists'); return; }
    groups.push(name);
    saveGroups(groups);
    document.getElementById('newGroupName').value = '';
    renderGroups();
};
renderGroups();
</script>
</body>
</html>
