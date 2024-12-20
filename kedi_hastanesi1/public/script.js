// Fetch and display all patients
async function fetchPatients() {
    const response = await fetch('/hastalar');
    const patients = await response.json();

    const tableBody = document.querySelector('#hastaTable tbody');
    tableBody.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${patient.isim}</td>
            <td>${patient.tur}</td>
            <td>${patient.yas}</td>
            <td>${patient.cinsiyet}</td>
            <td>${patient.saglikdurumu || ''}</td>
            <td>${patient.sahipbilgileri || ''}</td>
            <td>
                <button onclick="deletePatient(${patient.hastaid})">Sil</button>
                <button onclick="editPatient(${patient.hastaid})">Düzenle</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Add a new patient
async function addPatient() {
    const isim = document.getElementById('isim').value;
    const tur = document.getElementById('tur').value;
    const yas = document.getElementById('yas').value;
    const cinsiyet = document.getElementById('cinsiyet').value;
    const saglikDurumu = document.getElementById('saglikDurumu').value;
    const sahipBilgileri = document.getElementById('sahipBilgileri').value;

    const response = await fetch('/hastalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri })
    });

    if (response.ok) {
        alert('Hasta başarıyla kaydedildi!');
        document.getElementById('hastaForm').reset();
        fetchPatients();
    } else {
        alert('Bir hata oluştu!');
    }
}

// Search for patients
async function searchPatients() {
    const isim = document.getElementById('araIsim').value;
    const tur = document.getElementById('araTur').value;

    let query = '/hastalar/arama?';
    if (isim) {
        query += `isim=${encodeURIComponent(isim)}&`;
    }
    if (tur) {
        query += `tur=${encodeURIComponent(tur)}`;
    }

    const response = await fetch(query);
    const patients = await response.json();

    const tableBody = document.querySelector('#hastaTable tbody');
    tableBody.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${patient.isim}</td>
            <td>${patient.tur}</td>
            <td>${patient.yas}</td>
            <td>${patient.cinsiyet}</td>
            <td>${patient.saglikdurumu || ''}</td>
            <td>${patient.sahipbilgileri || ''}</td>
            <td>
                <button onclick="deletePatient(${patient.hastaid})">Sil</button>
                <button onclick="editPatient(${patient.hastaid})">Düzenle</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Edit a patient
async function editPatient(id) {
    const isim = prompt('Yeni İsim:');
    const tur = prompt('Yeni Tür:');
    const yas = prompt('Yeni Yaş:');
    const cinsiyet = prompt('Yeni Cinsiyet (Dişi/Erkek):');
    const saglikDurumu = prompt('Yeni Sağlık Durumu:');
    const sahipBilgileri = prompt('Yeni Sahip Bilgileri:');

    if (!isim || !yas || !cinsiyet) {
        alert('İsim, yaş ve cinsiyet zorunludur.');
        return;
    }

    const response = await fetch(`/hastalar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri })
    });

    if (response.ok) {
        alert('Hasta başarıyla güncellendi!');
        fetchPatients();
    } else {
        alert('Bir hata oluştu!');
    }
}

// Delete a patient
async function deletePatient(id) {
    const response = await fetch(`/hastalar/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Hasta başarıyla silindi!');
        fetchPatients();
    } else {
        alert('Bir hata oluştu!');
    }
}

// Fetch patients on page load
fetchPatients();
