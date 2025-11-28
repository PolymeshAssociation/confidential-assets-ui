/**
 * Utility functions for file operations
 */

/**
 * Triggers a browser download for a JSON object
 * @param data The data to download (will be JSON stringified)
 * @param filename The filename to save as (e.g., 'backup.json')
 */
export function downloadJsonFile(data: unknown, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses a JSON file
 * @param file The file object from an input element
 * @returns Promise resolving to the parsed JSON object
 */
export function readJsonFile<T = unknown>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Failed to read file content');
        }
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.readAsText(file);
  });
}
