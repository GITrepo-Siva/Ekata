
import type { PriceData } from './types';

export const parseCsvToPriceData = (csvText: string): PriceData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error("CSV file must have a header and at least one data row.");
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());

    const findIndex = (headers: string[], possibleNames: string[]): number => 
        headers.findIndex(h => possibleNames.some(p => h.includes(p)));

    const dateCol = findIndex(header, ['date']);
    const arabicaCol = findIndex(header, ['arabica']);
    const robustaCol = findIndex(header, ['robusta']);

    if (dateCol === -1 || arabicaCol === -1 || robustaCol === -1) {
        throw new Error("Invalid CSV format. Header must contain columns for 'Date', 'Arabica', and 'Robusta'.");
    }

    const parsedData = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        if (values.length < header.length) return null; // Skip malformed rows

        const date = values[dateCol]?.trim();
        const arabica_price = parseFloat(values[arabicaCol]?.trim());
        const robusta_price = parseFloat(values[robustaCol]?.trim());

        if (!date || isNaN(arabica_price) || isNaN(robusta_price)) {
            console.warn(`Skipping invalid data row ${index + 2}: ${line}`);
            return null;
        }

        // Basic date validation (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            console.warn(`Skipping row with invalid date format ${index + 2}: ${date}`);
            return null;
        }

        return {
            date,
            arabica_price,
            robusta_price,
        };
    }).filter((item): item is PriceData => item !== null);
    
    if (parsedData.length === 0) {
        throw new Error("Could not parse any valid data rows from the CSV file.");
    }

    return parsedData;
};
