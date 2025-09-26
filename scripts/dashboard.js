document.addEventListener("DOMContentLoaded", function () {
    
    // --- All Your Existing Dashboard Logic Goes Here ---
    const editBtn = document.querySelector(".edit-profile-btn");
    const editModal = document.getElementById("editModal");
    const closeModalBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const editForm = document.getElementById("editForm");
    
    // Avatar elements
    const profilePicInput = document.getElementById("profilePic");
    const avatarPreview = document.getElementById("avatarPreview");
    
    // Profile card elements
    const profileNameEl = document.querySelector(".profile-card h2");
    const profileEmailEl = document.querySelector(".profile-card .email");
    const profilePhoneEl = document.querySelector(".profile-card .phone");
    const profileInstitutionEl = document.querySelector(".profile-card .institution");
    const profileBranchEl = document.querySelector(".profile-card .detail-item:nth-child(1) p");
    const profileYearEl = document.querySelector(".profile-card .detail-item:nth-child(2) p");
    const profileStudentIDEl = document.querySelector(".profile-card .detail-item:nth-child(3) p");
    const profileAvatarWrapper = document.querySelector(".profile-card .avatar");
    
    // Modal functions
    function openModal() {
        editModal.classList.add("active");
        editModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeEditModal() {
        editModal.classList.remove("active");
        editModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    
    // Event listeners for modal
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            if (profileNameEl) document.getElementById("name").value = profileNameEl.textContent.trim();
            if (profileEmailEl) document.getElementById("email").value = profileEmailEl.textContent.trim();
            if(profilePhoneEl) { document.getElementById("phone").value = profilePhoneEl.textContent.trim(); }
            if (profileInstitutionEl) document.getElementById("institution").value = profileInstitutionEl.textContent.trim();
            if (profileBranchEl) document.getElementById("branch").value = profileBranchEl.textContent.trim();
            if (profileYearEl) document.getElementById("year").value = profileYearEl.textContent.trim();
            if (profileStudentIDEl) document.getElementById("studentID").value = profileStudentIDEl.textContent.trim();
            
            const existingImg = profileAvatarWrapper.querySelector("img");
            if (existingImg) {
                avatarPreview.src = existingImg.src;
            } else {
                avatarPreview.src = "../assets/index/images/default-avatar.png";
            }
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeEditModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeEditModal);
    }
    if (editModal) {
        editModal.addEventListener("click", (e) => {
            if (e.target === editModal) closeEditModal();
        });
    }

    // Avatar change functionality
    if (profilePicInput) {
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
                const existingImg = profileAvatarWrapper.querySelector("img");
                if (existingImg) {
                    existingImg.src = reader.result;
                } else {
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
    }

    // Handle form submission and update the profile card
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const institution = document.getElementById("institution").value.trim();
            const branch = document.getElementById("branch").value.trim();
            const year = document.getElementById("year").value.trim();
            const studentID = document.getElementById("studentID").value.trim();

            if (profileNameEl) profileNameEl.textContent = name;
            if (profileEmailEl) profileEmailEl.textContent = email;
            if (profilePhoneEl) profilePhoneEl.textContent = phone;
            if (profileInstitutionEl) profileInstitutionEl.textContent = institution;
            if (profileBranchEl) profileBranchEl.textContent = branch;
            if (profileYearEl) profileYearEl.textContent = year;
            if (profileStudentIDEl) profileStudentIDEl.textContent = studentID;

            alert("Profile updated successfully!");
            closeEditModal();
        });
    }
});