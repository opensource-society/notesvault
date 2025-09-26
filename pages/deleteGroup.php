<?php
// deleteGroup.php: Deletes a group by name
header('Content-Type: application/json');

$groupsFile = '../data/groups.json';
if (!file_exists($groupsFile)) {
    echo json_encode(['success' => false, 'message' => 'No groups found.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $groupName = trim($data['groupName'] ?? '');
    if ($groupName === '') {
        echo json_encode(['success' => false, 'message' => 'Group name required.']);
        exit;
    }
    $groups = json_decode(file_get_contents($groupsFile), true);
    $found = false;
    $newGroups = [];
    foreach ($groups as $group) {
        if (strtolower($group['name']) === strtolower($groupName)) {
            $found = true;
            continue; // skip this group (delete)
        }
        $newGroups[] = $group;
    }
    if ($found) {
        file_put_contents($groupsFile, json_encode($newGroups, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Group deleted.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Group not found.']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
