document.addEventListener("DOMContentLoaded", () => {
    if (typeof Html5Qrcode === "undefined") {
        console.error("Error: Html5Qrcode no está definido. Asegúrate de que la biblioteca está cargada.");
        return;
    }

    const qrReaderElement = document.getElementById("qr-reader");
    const resultContainer = document.getElementById("result");
    const cameraSelect = document.createElement("select");
    cameraSelect.id = "camera-select";
    document.body.insertBefore(cameraSelect, qrReaderElement);
    let qrReader;

    // Cargar datos guardados en LocalStorage
    const savedResult = localStorage.getItem("lastScannedQR");
    if (savedResult) {
        resultContainer.innerHTML = `Último código escaneado: <a href="${savedResult}" target="_blank">${savedResult}</a>`;
    }

    const onScanSuccess = (decodedText) => {
        resultContainer.innerHTML = `Código detectado: <a href="${decodedText}" target="_blank">${decodedText}</a>`;
        localStorage.setItem("lastScannedQR", decodedText); // Guardar en LocalStorage

        // Preguntar si redirigir
        if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
            if (confirm("¿Quieres ir al enlace detectado?")) {
                window.location.href = decodedText;
            }
        }
    };

    const onScanFailure = (error) => {
        console.warn("No se detectó un código válido");
    };

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length > 0) {
            devices.forEach(device => {
                let option = document.createElement("option");
                option.value = device.id;
                option.text = device.label || `Cámara ${cameraSelect.length + 1}`;
                cameraSelect.appendChild(option);
            });

            cameraSelect.addEventListener("change", () => {
                if (qrReader) {
                    qrReader.stop().then(() => {
                        startScanner(cameraSelect.value);
                    }).catch(err => console.error("Error deteniendo escáner", err));
                } else {
                    startScanner(cameraSelect.value);
                }
            });

            startScanner(devices[0].id); // Iniciar con la primera cámara por defecto
        } else {
            resultContainer.innerText = "No se encontraron cámaras disponibles.";
        }
    }).catch(err => console.error("Error obteniendo cámaras", err));

    function startScanner(cameraId) {
        qrReader = new Html5Qrcode("qr-reader");
        qrReader.start(
            cameraId,
            { fps: 15, qrbox: { width: 300, height: 300 } },
            onScanSuccess,
            onScanFailure
        ).catch(err => console.error("Error iniciando escáner", err));
    }
});