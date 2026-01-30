/**
 * Converts an array of objects to a CSV string and triggers a file download.
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // Extract headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(","), // Header row
        ...data.map(row =>
            headers.map(fieldName => {
                // Handle values that might contain commas or newlines
                const value = row[fieldName]?.toString() || "";
                return `"${value.replace(/"/g, '""')}"`; // Escape quotes
            }).join(",")
        )
    ].join("\n");

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
