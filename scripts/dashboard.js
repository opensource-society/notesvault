const editBtn = document.querySelector(".edit-profile-btn");
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const editForm = document.getElementById("editForm");

const profileName = document.querySelector(".profile-card h2");
const profileEmail = document.querySelector(".profile-card .email");
const profilePhone = document.querySelector(".profile-card .phone");
const profileInstitution = document.querySelector(".profile-card .institution");

// Avatar Preview
const profilePicInput = document.getElementById("profilePic");
const avatarPreview = document.getElementById("avatarPreview");
const profileCardAvatar = document.querySelector(".profile-card .avatar img, .profile-card .avatar i");

editBtn.addEventListener("click", () => editModal.classList.add("active"));
closeModal.addEventListener("click", () => editModal.classList.remove("active"));
cancelBtn.addEventListener("click", () => editModal.classList.remove("active"));

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profileName.textContent = document.getElementById("name").value;
  profileEmail.textContent = document.getElementById("email").value;
  profilePhone.textContent = document.getElementById("phone").value;
  profileInstitution.textContent = document.getElementById("institution").value;
  alert("Profile updated successfully!");
  editModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) editModal.classList.remove("active");
});
profilePicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      avatarPreview.src = reader.result;
      // Optionally update dashboard avatar too
      if(profileCardAvatar.tagName === "IMG") {
        profileCardAvatar.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
});

// ---------- Edit Profile Modal & Avatar handling ----------
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.querySelector(".edit-profile-btn");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const editForm = document.getElementById("editForm");

  // Avatar elements
  const profilePicInput = document.getElementById("profilePic");
  const avatarPreview = document.getElementById("avatarPreview");

  // dashboard profile (can be icon <i> or <img>)
  const profileAvatarWrapper = document.querySelector(".profile-card .avatar");

  // open modal and prefill fields from profile card
  editBtn.addEventListener("click", () => {
    // Prefill simple fields if present on dashboard
    const profileNameEl = document.querySelector(".profile-card h2");
    const emailEl = document.querySelector(".profile-card .email");
    const instEl = document.querySelector(".profile-card .institution");
    const detailItems = document.querySelectorAll(".profile-card .detail-item p");

    if (profileNameEl) document.getElementById("name").value = profileNameEl.textContent.trim();
    if (emailEl) document.getElementById("email").value = emailEl.textContent.trim();
    if (instEl) document.getElementById("institution").value = instEl.textContent.trim();
    if (detailItems && detailItems.length >= 3) {
      // branch, year, studentID
      if (detailItems[0]) document.getElementById("branch").value = detailItems[0].textContent.trim();
      if (detailItems[1]) document.getElementById("year").value = detailItems[1].textContent.trim();
      if (detailItems[2]) document.getElementById("studentID").value = detailItems[2].textContent.trim();
    }

    // If the profile card already has an <img>, copy its src to avatarPreview
    const existingImg = profileAvatarWrapper.querySelector("img");
    if (existingImg) {
      avatarPreview.src = existingImg.src;
    }

    editModal.classList.add("active");
    editModal.setAttribute("aria-hidden", "false");
    // optional: prevent background scroll
    document.body.style.overflow = "hidden";
  });

  function closeEditModal() {
    editModal.classList.remove("active");
    editModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // restore
  }

  closeModal.addEventListener("click", closeEditModal);
  cancelBtn.addEventListener("click", closeEditModal);

  // close when clicking overlay outside modal content
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeEditModal();
  });

  // Avatar change: update preview and dashboard avatar
profilePicInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file (jpg, png, etc.)");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    avatarPreview.src = reader.result;

    // profile card avatar wrapper
    const profileAvatarWrapper = document.querySelector(".profile-card .avatar");
    const existingImg = profileAvatarWrapper.querySelector("img");

    if (existingImg) {
      // Already an image → update it
      existingImg.src = reader.result;
    } else {
      // Replace the icon with an image
      profileAvatarWrapper.innerHTML = "";
      const img = document.createElement("img");
      img.src = reader.result;
      img.alt = "Profile avatar";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      profileAvatarWrapper.appendChild(img);
    }
  };
  reader.readAsDataURL(file);
});

  // Single submit handler (updates profile card elements)
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
    const institution = document.getElementById("institution").value.trim();
    const branch = document.getElementById("branch").value.trim();
    const year = document.getElementById("year").value.trim();
    const studentID = document.getElementById("studentID").value.trim();

    // Update profile card
    const profileNameEl = document.querySelector(".profile-card h2");
    const emailEl = document.querySelector(".profile-card .email");
    const instEl = document.querySelector(".profile-card .institution");
    const detailItems = document.querySelectorAll(".profile-card .detail-item p");

    if (profileNameEl && name) profileNameEl.textContent = name;
    if (emailEl && email) emailEl.textContent = email;
    if (instEl && institution) instEl.textContent = institution;
    if (detailItems && detailItems.length >= 3) {
      if (branch) detailItems[0].textContent = branch;
      if (year) detailItems[1].textContent = year;
      if (studentID) detailItems[2].textContent = studentID;
    }

    // show success (you can replace with nicer toast)
    alert("Profile updated successfully!");
    closeEditModal();
  });
});

// Save changes (include avatar)
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const institution = document.getElementById("institution").value;
  const branch = document.getElementById("branch").value;
  const year = document.getElementById("year").value;
  const studentID = document.getElementById("studentID").value;

  // Update profile card
  document.querySelector(".profile-card h2").textContent = name;
  document.querySelector(".profile-card .email").textContent = email;
  document.querySelector(".profile-card .phone").textContent = phone;
  document.querySelector(".profile-card .institution").textContent = institution;
  document.querySelector(".profile-card .detail-item:nth-child(1) p").textContent = branch;
  document.querySelector(".profile-card .detail-item:nth-child(2) p").textContent = year;
  document.querySelector(".profile-card .detail-item:nth-child(3) p").textContent = studentID;

  alert("Profile updated successfully!");
  editModal.style.display = "none";
});