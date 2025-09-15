const fs = require('fs');
const path = require('path');

// Menentukan path untuk file log di dalam folder backend
const logFilePath = path.join(__dirname, '../activity.log');

/**
 * Mencatat aktivitas ke dalam file log.
 * @param {string} message - Pesan log yang akan dicatat.
 */
const logActivity = (message) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;

  // Menambahkan log ke file activity.log
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Gagal menulis log:', err);
    }
  });
};

module.exports = { logActivity };