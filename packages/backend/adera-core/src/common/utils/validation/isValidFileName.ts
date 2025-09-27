function filenameReservedRegex() {
  // eslint-disable-next-line no-control-regex
  return /[<>:"/\\|?*\u0000-\u001F]/g;
}

function windowsReservedNameRegex() {
  return /^(con|prn|aux|nul|com\d|lpt\d)$/i;
}

function allDotesRegex() {
  return /^\.+/;
}

export function isValidFileName(fileName: unknown): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }
  const _fileName = fileName.trim();
  if (_fileName.length > 255) {
    return false;
  }
  if (
    filenameReservedRegex().test(_fileName) ||
    windowsReservedNameRegex().test(_fileName) ||
    allDotesRegex().test(_fileName)
  ) {
    return false;
  }
  if (_fileName === '' || !_fileName.includes('.')) {
    return false;
  }
  const extension = _fileName.slice(_fileName.lastIndexOf('.') + 1);
  if (extension === '') {
    return false;
  }
  return true;
}
