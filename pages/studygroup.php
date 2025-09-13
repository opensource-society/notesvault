<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - Study Groups</title>

    <!-- Favicon -->
    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../styling/studygroup.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
    <!-- Header -->
    <div id="header-placeholder"></div>

    <!-- Hero Section -->
    <section class="studygroup-hero">
      <div class="container">
        <h1>Study Groups</h1>
        <p class="subtitle">
          Make a group with friends, share notes, chat, schedule meetings, and play subject-based games—all in one collaborative space.
        </p>
      </div>
    </section>

    <!-- Main Section -->
    <main class="studygroup-container">
      <div class="group-actions">
        <button id="createGroupBtn"><i class="fas fa-users"></i> Create Group</button>
        <input type="text" id="joinGroupInput" placeholder="Enter Group Code to Join" />
        <button id="joinGroupBtn"><i class="fas fa-sign-in-alt"></i> Join Group</button>
      </div>

      <div class="groups-list" id="groupsList">
        <!-- Groups will be listed here -->
      </div>

      <div class="group-details" id="groupDetails" style="display:none;">
        <h2 id="groupName"></h2>
        <div class="group-tabs">
          <button class="tab-btn active" data-tab="chat">Chat</button>
          <button class="tab-btn" data-tab="notes">Notes</button>
          <button class="tab-btn" data-tab="meeting">Meeting</button>
          <button class="tab-btn" data-tab="games">Games</button>
          <button class="tab-btn" data-tab="members">Members</button>
        </div>

        <!-- Chat -->
        <div class="tab-content" id="chatTab">
          <div class="chat-box" id="chatBox"></div>
          <input type="text" id="chatInput" placeholder="Type a message..." />
          <button id="sendChatBtn"><i class="fas fa-paper-plane"></i> Send</button>
        </div>

        <!-- Notes -->
        <div class="tab-content" id="notesTab" style="display:none;">
          <div class="notes-share">
            <input type="text" id="noteTitleInput" placeholder="Note Title" />
            <textarea id="noteContentInput" placeholder="Note Content"></textarea>
            <button id="shareNoteBtn"><i class="fas fa-share"></i> Share Note</button>
          </div>
          <div class="shared-notes" id="sharedNotes"></div>
        </div>

        <!-- Meetings -->
        <div class="tab-content" id="meetingTab" style="display:none;">
          <input type="datetime-local" id="meetingTimeInput" />
          <button id="scheduleMeetingBtn"><i class="fas fa-calendar-plus"></i> Schedule Meeting</button>
          <div class="scheduled-meetings" id="scheduledMeetings"></div>
        </div>

        <!-- Games simplified -->
        <div class="tab-content" id="gamesTab" style="display:none;">
          <div class="game-box">
            <label for="inviteEmails">Invite by emails (comma separated):</label>
            <input type="text" id="inviteEmails" placeholder="alice@example.com, bob@example.com" />
            <button id="inviteByEmailBtn"><i class="fas fa-envelope"></i> Invite</button>
            <div id="inviteResult" style="margin-top:0.8rem; color:var(--text-secondary)"></div>
          </div>
        </div>

        <!-- Members -->
        <div class="tab-content" id="membersTab" style="display:none;">
          <input type="text" id="memberEmailInput" placeholder="Add member by email..." />
          <button id="addMemberBtn"><i class="fas fa-user-plus"></i> Add Member</button>
          <ul class="members-list" id="membersList"></ul>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
     <script src="../scripts/script.js"></script>
    <script src="../scripts/studygroup.js"></script>
  </body>
</html>