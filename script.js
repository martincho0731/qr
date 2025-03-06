document.addEventListener("DOMContentLoaded", () => {
    if (typeof Html5Qrcode === "undefined") {
        console.error("Error: Html5Qrcode no está definido. Asegúrate de que la biblioteca está cargada.");
        return;
    }

    const qrReaderElement = document.getElementById("qr-reader");
    const resultContainer = document.getElementById("result");
    let qrReader;

    // Cargar datos guardados en LocalStorage
    const savedResult = localStorage.getItem("lastScannedQR");
    if (savedResult) {
        resultContainer.innerText = `Último código escaneado: ${savedResult}`;
    }

    const onScanSuccess = (decodedText) => {
        resultContainer.innerText = `Código detectado: ${decodedText}`;
        localStorage.setItem("lastScannedQR", decodedText); // Guardar en LocalStorage
    };

    const onScanFailure = (error) => {
        console.warn("No se detectó un código válido");
    };

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length > 0) {
            let cameraId = devices[0].id;
            qrReader = new Html5Qrcode("qr-reader");
            qrReader.start(
                cameraId,
                { fps: 15, qrbox: { width: 300, height: 300 } },
                onScanSuccess,
                onScanFailure
            ).catch(err => console.error("Error iniciando escáner", err));
        } else {
            resultContainer.innerText = "No se encontraron cámaras disponibles.";
        }
    }).catch(err => console.error("Error obteniendo cámaras", err));
});