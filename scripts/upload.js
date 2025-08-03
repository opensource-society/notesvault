document.addEventListener('DOMContentLoaded', function () {
        let branchData
        const branchSelect = document.getElementById('branch')
        const semesterSelect = document.getElementById('semester')
        const subjectSelect = document.getElementById('subject')

        // Custom input containers
        const customBranchContainer = document.getElementById(
          'customBranchContainer'
        )
        const customSemesterContainer = document.getElementById(
          'customSemesterContainer'
        )
        const customSubjectContainer = document.getElementById(
          'customSubjectContainer'
        )

        // Fetch branch data
        fetch('../data/search_parameters/parameters.json')
          .then((response) => response.json())
          .then((data) => {
            branchData = data

            // Populate branches
            data.branches.forEach((branch) => {
              const option = document.createElement('option')
              option.value = typeof branch === 'object' ? branch.name : branch
              option.textContent =
                typeof branch === 'object' ? branch.name : branch
              branchSelect.insertBefore(option, branchSelect.lastChild)
            })
          })
          .catch((error) => console.error('Error loading branch data:', error))

        // Branch change handler
        branchSelect.addEventListener('change', function (e) {
          semesterSelect.innerHTML =
            '<option value="">Select Semester</option><option value="custom">Add Custom Semester...</option>'
          semesterSelect.disabled = false

          if (e.target.value === 'custom') {
            customBranchContainer.style.display = 'flex'
            semesterSelect.disabled = true
            subjectSelect.disabled = true
            return
          }

          customBranchContainer.style.display = 'none'

          const selectedBranch = e.target.value
          const branch = branchData.branches.find((b) =>
            typeof b === 'object'
              ? b.name === selectedBranch
              : b === selectedBranch
          )

          if (branch && typeof branch === 'object') {
            branch.semesters.forEach((sem) => {
              const option = document.createElement('option')
              option.value = sem.semester
              option.textContent = `Semester ${sem.semester}`
              semesterSelect.insertBefore(option, semesterSelect.lastChild)
            })
          }
        })

        // Semester change handler
        semesterSelect.addEventListener('change', function (e) {
          subjectSelect.innerHTML =
            '<option value="">Select Subject</option><option value="custom">Add Custom Subject...</option>'
          subjectSelect.disabled = false

          if (e.target.value === 'custom') {
            customSemesterContainer.style.display = 'flex'
            subjectSelect.disabled = true
            return
          }

          customSemesterContainer.style.display = 'none'

          const branch = branchSelect.value
          const semester = parseInt(e.target.value)
          const branchObj = branchData.branches.find((b) =>
            typeof b === 'object' ? b.name === branch : b === branch
          )

          if (branchObj && typeof branchObj === 'object') {
            const semesterObj = branchObj.semesters.find(
              (s) => s.semester === semester
            )
            if (semesterObj) {
              semesterObj.subjects.forEach((sub) => {
                const code = Object.keys(sub)[0]
                const name = sub[code]
                const option = document.createElement('option')
                option.value = code
                option.textContent = `${code} - ${name}`
                subjectSelect.insertBefore(option, subjectSelect.lastChild)
              })
            }
          }
        })

        // Subject change handler
        subjectSelect.addEventListener('change', function (e) {
          if (e.target.value === 'custom') {
            customSubjectContainer.style.display = 'flex'
            return
          }
          customSubjectContainer.style.display = 'none'
        })

        // Confirm custom branch
        document
          .getElementById('confirmBranch')
          .addEventListener('click', function () {
            const customBranch = document
              .getElementById('customBranch')
              .value.trim()
            if (customBranch) {
              // Add the custom branch to the dropdown
              const option = document.createElement('option')
              option.value = customBranch
              option.textContent = customBranch
              branchSelect.insertBefore(option, branchSelect.lastChild)
              branchSelect.value = customBranch
              customBranchContainer.style.display = 'none'
              semesterSelect.disabled = false
            }
          })

        // Confirm custom semester
        document
          .getElementById('confirmSemester')
          .addEventListener('click', function () {
            const customSemester = document
              .getElementById('customSemester')
              .value.trim()
            if (customSemester) {
              // Add the custom semester to the dropdown
              const option = document.createElement('option')
              option.value = customSemester
              option.textContent = `Semester ${customSemester}`
              semesterSelect.insertBefore(option, semesterSelect.lastChild)
              semesterSelect.value = customSemester
              customSemesterContainer.style.display = 'none'
              subjectSelect.disabled = false
            }
          })

        // Confirm custom subject
        document
          .getElementById('confirmSubject')
          .addEventListener('click', function () {
            const code = document
              .getElementById('customSubjectCode')
              .value.trim()
            const name = document
              .getElementById('customSubjectName')
              .value.trim()
            if (code && name) {
              // Add the custom subject to the dropdown
              const option = document.createElement('option')
              option.value = code
              option.textContent = `${code} - ${name}`
              subjectSelect.insertBefore(option, subjectSelect.lastChild)
              subjectSelect.value = code
              customSubjectContainer.style.display = 'none'
            }
          })

        // File drop zone functionality
        const dropZone = document.getElementById('drop-zone')
        const fileInput = document.getElementById('file')
        const preview = document.getElementById('preview')

        dropZone.addEventListener('click', () => fileInput.click())

        fileInput.addEventListener('change', handleFileSelect)

        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
          dropZone.addEventListener(eventName, preventDefaults, false)
        })

        function preventDefaults(e) {
          e.preventDefault()
          e.stopPropagation()
        }

        function handleDrop(e) {
          const dt = e.dataTransfer
          const files = dt.files
          fileInput.files = files
          handleFileSelect({ target: fileInput })
        }

        function handleFileSelect(e) {
          const files = e.target.files
          if (files.length) {
            preview.innerHTML = ''
            const file = files[0]
            const fileInfo = document.createElement('div')
            fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(
              file.size
            )})`
            preview.appendChild(fileInfo)
          }
        }

        function formatFileSize(bytes) {
          if (bytes === 0) return '0 Bytes'
          const k = 1024
          const sizes = ['Bytes', 'KB', 'MB', 'GB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
          )
        }

        // Form submission
        document
          .getElementById('uploadForm')
          .addEventListener('submit', function (e) {
            e.preventDefault()
            const message = document.getElementById('message')
            message.textContent =
              '✅ Notes uploaded successfully (for demo purposes only — not stored)'
            message.className = 'status-message success'
            this.reset()
            preview.innerHTML = ''

            // Reset custom inputs
            customBranchContainer.style.display = 'none'
            customSemesterContainer.style.display = 'none'
            customSubjectContainer.style.display = 'none'
            semesterSelect.disabled = true
            subjectSelect.disabled = true
          })
      })