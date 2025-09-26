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
    <link rel="stylesheet" href="../styling/group-card.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
    <!-- Header -->
    <?php include '../components/header.php'; ?>

    <!-- Hero Section -->
    <section class="studygroup-hero">
      <div class="container">
        <h1>Study Groups</h1>
        <p class="subtitle">
          Make a group with friends, share notes, chat, schedule meetings, and
          play subject-based games—all in one collaborative space.
        </p>
      </div>
    </section>

    <!-- Main Section -->
    <main class="studygroup-container">
      <div class="group-actions">
        <button id="createGroupBtn"
          style="background:#90ee90; color:#222; border:none; border-radius:5px; padding:7px 16px; font-size:0.97rem; cursor:pointer;">
          <i class="fas fa-users"></i> Create Group
        </button>

        <!-- Join Group -->
        <input
          type="text"
          id="joinGroupInput"
          placeholder="Enter group name to join"
          style="padding:7px 10px; border-radius:5px; border:1px solid #cbd5e1; font-size:0.97rem; margin-left:10px;"
        />
        <button id="joinGroupBtn"
          style="background:#90ee90; color:#222; border:none; border-radius:5px; padding:7px 16px; font-size:0.97rem; cursor:pointer;">
          Join Group
        </button>
      </div>

      <!-- Create Group Modal -->
      <div id="createGroupModal" class="create-group-modal" style="display: none">
        <h3 class="create-group-title">Create a New Group</h3>
        <input
          type="text"
          id="groupNameInput"
          class="create-group-input"
          placeholder="Enter group name"
        />
        <div class="create-group-btns">
          <button id="submitGroupBtn" class="create-group-btn create"
            style="background:#90ee90; color:#222;">Create</button>
          <button id="closeGroupModal" class="create-group-btn cancel">Cancel</button>
        </div>
        <div id="groupCreateMsg" class="create-group-msg"></div>
      </div>

      <!-- Groups List -->
      <div class="groups-list" id="groupsList">
        <!-- Groups will be listed here -->
      </div>
    </main>

    <!-- Footer -->
      <?php include '../components/footer.php'; ?>
    <!-- JavaScript -->
        <script src="../scripts/header.js" defer></script>
        <script src="../scripts/script.js" defer></script>
    <script>
      // Local cache for groups so UI can be updated optimistically
      let cachedGroups = [];

      // Utility: render groups from an array
      function renderGroups(groups) {
        cachedGroups = Array.isArray(groups) ? groups.slice() : [];
        const userEmail = localStorage.getItem("userEmail") || "demo@user.com";
        let html = "";
        if (!cachedGroups || cachedGroups.length === 0) {
          html = "<p>No groups created yet.</p>";
        } else {
          cachedGroups.forEach((group) => {
            const leaveBtn =
              group.members && group.members.includes(userEmail) && group.creator !== userEmail
                ? `<button class="leaveBtn" data-group="${escapeHtml(group.name)}">Leave Group</button>`
                : "";

            const goInsideBtn =
              group.members && group.members.includes(userEmail)
                ? `<button class="goInsideBtn" data-group="${escapeHtml(group.name)}" 
                    style="background:#7ed957; color:#222; border:none; border-radius:5px; 
                    padding:7px 16px; font-size:0.97rem; cursor:pointer; margin-right:8px;">
                    Go Inside</button>`
                : "";

            const deleteBtn =
              group.creator === userEmail
                ? `<button class="deleteBtn" data-group="${escapeHtml(group.name)}">Delete Group</button>`
                : "";

            const addMember =
              group.creator === userEmail
                ? `<div style="margin-top:10px;">
                    <input type="email" class="addMemberInput" placeholder="Add member by email"
                      style="width:70%; padding:7px 10px; margin-right:8px; border-radius:5px; border:1px solid #cbd5e1; font-size:0.97rem;" />
                    <button class="addMemberBtn" data-group="${escapeHtml(group.name)}"
                      style="background:#90ee90; color:#222; border:none; border-radius:5px; padding:7px 16px; font-size:0.97rem; cursor:pointer;">
                      Add Member
                    </button>
                    <div class="addMemberMsg" style="color:red; margin-top:5px; font-size:0.95rem;"></div>
                  </div>`
                : "";

            html += `
              <div class="group-card${group.justCreated ? " new-group" : ""}">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <h4 style="margin:0; color:${group.justCreated ? "#7c3aed" : "#4f46e5"}; font-size:1.15rem;">${escapeHtml(group.name)}</h4>
                  ${group.justCreated ? '<span style="background:#7c3aed; color:#fff; border-radius:4px; padding:2px 8px; font-size:0.92rem;">New</span>' : ""}
                </div>
                <p style="margin:0 0 6px 0; color:#4f46e5; font-size:0.97rem;">Created by: ${escapeHtml(group.creator)}</p>
                <p style="margin:0 0 10px 0; color:#555; font-size:0.96rem;">Members: ${Array.isArray(group.members) ? group.members.length : 0}</p>
                ${addMember}
                ${leaveBtn}
                ${goInsideBtn}
                ${deleteBtn}
              </div>
            `;
          });
        }
        document.getElementById("groupsList").innerHTML = html;
      }

      // Safe HTML escape for injected values
      function escapeHtml(str) {
        if (typeof str !== "string") return "";
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      // Fetch groups.json from server and render (with fallback to cachedGroups)
      function loadGroups() {
        fetch("../data/groups.json", { cache: "no-store" })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load groups.json");
            return res.json();
          })
          .then((groups) => {
            // Ensure groups is an array
            if (!Array.isArray(groups)) groups = [];
            renderGroups(groups);
          })
          .catch((err) => {
            console.warn("Could not fetch groups.json — using cachedGroups if available", err);
            // if cachedGroups already set, render them; otherwise show empty
            renderGroups(cachedGroups || []);
          });
      }

      // Find group by name (case-insensitive)
      function findGroupIndexByName(name) {
        return cachedGroups.findIndex(g => g.name && g.name.toLowerCase() === name.toLowerCase());
      }

      // Page load
      window.onload = loadGroups;

      // Open/close create modal
      document.getElementById("createGroupBtn").addEventListener("click", () => {
        document.getElementById("createGroupModal").style.display = "block";
      });
      document.getElementById("closeGroupModal").addEventListener("click", () => {
        document.getElementById("createGroupModal").style.display = "none";
        document.getElementById("groupCreateMsg").innerText = "";
      });

      // Submit group creation — optimistic UI update if server doesn't update file immediately
      document.getElementById("submitGroupBtn").addEventListener("click", () => {
        const groupName = document.getElementById("groupNameInput").value.trim();
        const msgDiv = document.getElementById("groupCreateMsg");
        if (!groupName) {
          msgDiv.style.color = "red";
          msgDiv.innerText = "Please enter a group name.";
          return;
        }
        // prevent duplicate locally
        if (findGroupIndexByName(groupName) !== -1) {
          msgDiv.style.color = "red";
          msgDiv.innerText = "A group with that name already exists.";
          return;
        }

        const creator = localStorage.getItem("userEmail") || "demo@user.com";

        fetch("groups.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupName: groupName, creator: creator }),
        })
        .then(res => res.json().catch(() => ({})))
        .then((data) => {
          // If server responded successfully, try to reload groups.json from server.
          // Otherwise, optimistically add the group locally so user sees it immediately.
          if (data && data.success) {
            msgDiv.style.color = "green";
            msgDiv.innerText = data.message || "Group created.";
            // attempt to fetch updated groups.json — if not updated, fallback below
            fetch("../data/groups.json", { cache: "no-store" })
              .then(r => r.ok ? r.json() : Promise.reject("no-json"))
              .then(groups => {
                // If server returned the new group, render it.
                if (Array.isArray(groups) && findGroupIndexByName(groupName) === -1) {
                  // mark the new group as justCreated for visual
                  const idx = groups.findIndex(g => g.name && g.name.toLowerCase() === groupName.toLowerCase());
                  if (idx !== -1) {
                    groups[idx].justCreated = true;
                  } else {
                    // server did not include the new group yet — append
                    groups.push({ name: groupName, creator: creator, members: [creator], justCreated: true });
                  }
                } else if (!Array.isArray(groups)) {
                  groups = [{ name: groupName, creator: creator, members: [creator], justCreated: true }];
                }
                renderGroups(groups);
              })
              .catch(() => {
                // server didn't update groups.json yet — optimistic local append
                const newGroup = { name: groupName, creator: creator, members: [creator], justCreated: true };
                cachedGroups.push(newGroup);
                renderGroups(cachedGroups);
              })
              .finally(() => {
                // close modal and clear
                setTimeout(() => {
                  document.getElementById("createGroupModal").style.display = "none";
                  msgDiv.innerText = "";
                  document.getElementById("groupNameInput").value = "";
                  // clear justCreated mark after a short delay (optional)
                  setTimeout(() => {
                    for (let g of cachedGroups) { delete g.justCreated; }
                    renderGroups(cachedGroups);
                  }, 2500);
                }, 800);
              });
          } else {
            // server didn't return success object — still optimistically create locally
            msgDiv.style.color = "green";
            msgDiv.innerText = data.message || "Group created (local).";
            const newGroup = { name: groupName, creator: creator, members: [creator], justCreated: true };
            cachedGroups.push(newGroup);
            renderGroups(cachedGroups);
            setTimeout(() => {
              document.getElementById("createGroupModal").style.display = "none";
              msgDiv.innerText = "";
              document.getElementById("groupNameInput").value = "";
              setTimeout(() => {
                for (let g of cachedGroups) { delete g.justCreated; }
                renderGroups(cachedGroups);
              }, 2500);
            }, 800);
          }
        })
        .catch((err) => {
          msgDiv.style.color = "red";
          msgDiv.innerText = "Could not create group (network error).";
          console.error("Create group failed:", err);
        });
      });

      // Delegated handlers: add member, leave, delete, go inside
      document.getElementById("groupsList").addEventListener("click", (e) => {
        const userEmail = localStorage.getItem("userEmail") || "demo@user.com";

        // Go inside
        if (e.target.classList.contains("goInsideBtn")) {
          const groupName = e.target.getAttribute("data-group");
          localStorage.setItem("selectedGroup", groupName);
          window.location.href = "groupdetails.php?group=" + encodeURIComponent(groupName);
          return;
        }

        // Leave group
        if (e.target.classList.contains("leaveBtn")) {
          const groupName = e.target.getAttribute("data-group");
          if (!confirm("Are you sure you want to leave this group?")) return;
          fetch("leaveGroup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupName: groupName, email: userEmail }),
          })
          .then(res => res.json().catch(()=>({})))
          .then(data => {
            // if server says success, remove from local cache; otherwise still remove locally
            const idx = findGroupIndexByName(groupName);
            if (idx !== -1) {
              const members = cachedGroups[idx].members || [];
              const newMembers = members.filter(m => m.toLowerCase() !== userEmail.toLowerCase());
              cachedGroups[idx].members = newMembers;
              // If user removed themselves completely and not creator, still keep group card visible for others.
              renderGroups(cachedGroups);
            }
            alert((data && data.message) || "Left group.");
          })
          .catch(err => {
            console.error("Leave failed:", err);
            alert("Could not leave group (network error).");
          });
          return;
        }

        // Add member (creator only)
        if (e.target.classList.contains("addMemberBtn")) {
          const groupName = e.target.getAttribute("data-group");
          // the structure: <input> <button.addMemberBtn data-group> <div.addMemberMsg>
          // but there may be whitespace nodes; use closest parent to find input & msg to be robust
          const container = e.target.parentElement;
          const emailInput = container.querySelector(".addMemberInput");
          const msgDiv = container.querySelector(".addMemberMsg");
          const email = emailInput ? emailInput.value.trim() : "";
          if (!email) {
            if (msgDiv) { msgDiv.style.color = "red"; msgDiv.innerText = "Enter an email."; }
            return;
          }
          if (msgDiv) { msgDiv.style.color = "orange"; msgDiv.innerText = "Adding..."; }
          fetch("addMember.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupName: groupName, email: email }),
          })
          .then(res => res.json().catch(()=>({})))
          .then(data => {
            if (data && data.success) {
              if (msgDiv) { msgDiv.style.color = "green"; msgDiv.innerText = data.message || "Member added."; }
            } else {
              if (msgDiv) { msgDiv.style.color = "green"; msgDiv.innerText = (data && data.message) || "Member added (local)."; }
            }
            // Optimistically update local cache
            const idx = findGroupIndexByName(groupName);
            if (idx === -1) {
              // group not present locally — fetch fresh list
              loadGroups();
            } else {
              const members = cachedGroups[idx].members || [];
              if (!members.includes(email)) {
                members.push(email);
                cachedGroups[idx].members = members;
              }
              renderGroups(cachedGroups);
            }
            if (emailInput) emailInput.value = "";
          })
          .catch(err => {
            console.error("Add member failed:", err);
            if (msgDiv) { msgDiv.style.color = "red"; msgDiv.innerText = "Could not add member (network)."; }
          });
          return;
        }

        // Delete group (creator only)
        if (e.target.classList.contains("deleteBtn")) {
          const groupName = e.target.getAttribute("data-group");
          if (!confirm("Delete this group? This cannot be undone.")) return;
          fetch("deleteGroup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupName: groupName }),
          })
          .then(res => res.json().catch(()=>({})))
          .then(data => {
            // Remove from cachedGroups anyway (optimistic)
            const idx = findGroupIndexByName(groupName);
            if (idx !== -1) {
              cachedGroups.splice(idx, 1);
              renderGroups(cachedGroups);
            } else {
              // try reload if not found
              loadGroups();
            }
            if (data && data.success) {
              // server confirmed deletion
              // (no extra UI action needed; group already removed)
            } else {
              // server didn't confirm — still removed locally
            }
          })
          .catch(err => {
            console.error("Delete failed:", err);
            alert("Could not delete group (network error).");
          });
          return;
        }
      });

      // Join group button — will update server and also update local UI optimistically
      document.getElementById("joinGroupBtn").addEventListener("click", () => {
        const groupCode = document.getElementById("joinGroupInput").value.trim();
        const userEmail = localStorage.getItem("userEmail") || "demo@user.com";
        if (!groupCode) {
          alert("Please enter a group name to join.");
          return;
        }

        // Load current groups (use cached if available)
        const tryGroups = cachedGroups.length ? cachedGroups : [];

        // attempt to find group locally (case-insensitive)
        let foundLocal = false;
        for (let g of tryGroups) {
          if (g.name && g.name.toLowerCase() === groupCode.toLowerCase()) {
            foundLocal = true;
            if (!Array.isArray(g.members)) g.members = [];
            if (!g.members.includes(userEmail)) {
              g.members.push(userEmail);
            }
            break;
          }
        }

        // Prepare to send updated groups to server. If we have fresh JSON, use it; otherwise fetch first.
        const sendUpdatedGroups = (groupsArr) => {
          // ensure groupsArr is array
          if (!Array.isArray(groupsArr)) groupsArr = tryGroups.length ? tryGroups : [];
          // if local didn't have the group, try to mark foundLocal by scanning groupsArr
          let found = groupsArr.some(g => g.name && g.name.toLowerCase() === groupCode.toLowerCase());
          // if not found and we earlier updated cachedGroups, set found true
          if (!found && findGroupIndexByName(groupCode) !== -1) found = true;

          if (!found) {
            alert("Group not found. Please check the name and try again.");
            return;
          }

          // Update groupsArr members (ensure userEmail present)
          groupsArr = groupsArr.map(g => {
            if (g.name && g.name.toLowerCase() === groupCode.toLowerCase()) {
              g.members = Array.isArray(g.members) ? g.members : [];
              if (!g.members.includes(userEmail)) g.members.push(userEmail);
            }
            return g;
          });

          fetch("groups.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groups: groupsArr }),
          })
          .then(res => res.json().catch(()=>({})))
          .then(data => {
            // Optimistically update local cache and UI
            const idx = findGroupIndexByName(groupCode);
            if (idx === -1) {
              // try to update cachedGroups by merging
              const serverGroup = (groupsArr.find(g => g.name && g.name.toLowerCase() === groupCode.toLowerCase()) || null);
              if (serverGroup) {
                cachedGroups.push(serverGroup);
              }
            } else {
              if (!cachedGroups[idx].members) cachedGroups[idx].members = [];
              if (!cachedGroups[idx].members.includes(userEmail)) cachedGroups[idx].members.push(userEmail);
            }
            renderGroups(cachedGroups);
            document.getElementById("joinGroupInput").value = "";
            alert((data && data.message) || "Joined group.");
          })
          .catch(err => {
            console.error("Join failed:", err);
            // fallback optimistic local update (try again later)
            const idx = findGroupIndexByName(groupCode);
            if (idx !== -1) {
              if (!cachedGroups[idx].members) cachedGroups[idx].members = [];
              if (!cachedGroups[idx].members.includes(userEmail)) cachedGroups[idx].members.push(userEmail);
              renderGroups(cachedGroups);
              document.getElementById("joinGroupInput").value = "";
              alert("Joined group (local).");
            } else {
              alert("Could not join group (network error).");
            }
          });
        };

        // If cachedGroups empty, try fetching groups.json first
        if (!cachedGroups.length) {
          fetch("../data/groups.json", { cache: "no-store" })
            .then(res => res.ok ? res.json() : Promise.reject("no-json"))
            .then(groups => {
              renderGroups(Array.isArray(groups) ? groups : []);
              sendUpdatedGroups(groups);
            })
            .catch(() => {
              // fallback: use cachedGroups even if empty
              sendUpdatedGroups(cachedGroups);
            });
        } else {
          sendUpdatedGroups(cachedGroups);
        }
      });
    </script>
  </body>
</html>
