export function getFileFormat(fileType: string): string {
    const mimeToExtensionMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'image/png': 'PNG',
      'image/jpeg': 'JPG',
      'image/jpg': 'JPG',
      'image/gif': 'GIF',
      'text/plain': 'TXT',
      'image/svg+xml': 'SVG',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/x-iwork-pages-sffpages': 'PAGES'
      // Tambahkan MIME type lain sesuai kebutuhan
    };
  
    return mimeToExtensionMap[fileType] || 'UNKNOWN';
  }