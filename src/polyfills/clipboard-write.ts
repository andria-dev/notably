import { DT, write } from 'clipboard-polyfill';

function DTFromText(text: string) {
  const dt = new DT();
  dt.setData('text/plain', text);
  return dt;
}

export function writeText(stringToCopy: string): Promise<void> {
  return write(DTFromText(stringToCopy));
}
