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