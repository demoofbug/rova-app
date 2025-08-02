document.addEventListener('DOMContentLoaded', () => {
    // Android Dropdown Logic
    const androidBtn = document.getElementById('android-main-btn');
    if (androidBtn) {
        const androidDropdown = androidBtn.nextElementSibling;

        androidBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the window click event from firing immediately
            androidDropdown.classList.toggle('show');
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener('click', function(e) {
            if (androidDropdown.classList.contains('show') && !androidBtn.contains(e.target)) {
                androidDropdown.classList.remove('show');
            }
        });
    }

    // Custom Select Dropdown Logic
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelectorAll('.custom-option');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function() {
                // Update the trigger text
                trigger.querySelector('span').textContent = this.textContent;
                
                // Handle the selected state
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Close the dropdown
                customSelect.classList.remove('open');

                // You can get the selected value using: this.dataset.value
                // console.log('Selected source:', this.dataset.value);
            });
        });

        // Close the custom select if clicking outside
        window.addEventListener('click', (e) => {
            if (customSelect.classList.contains('open') && !customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }
});