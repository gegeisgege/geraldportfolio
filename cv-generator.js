// CV Generator - Downloads the actual CV.pdf file
class CVGenerator {
    constructor() {
        this.cvPath = 'CV.pdf'; // Path to your CV file
    }

    async generatePDF() {
        try {
            // Simply download the existing CV.pdf file
            const link = document.createElement('a');
            link.href = this.cvPath;
            link.download = 'Gerald_Mahapranaja_Pillian_CV.pdf';
            link.click();
            return true;
        } catch (error) {
            console.error('Error downloading CV:', error);
            return false;
        }
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVGenerator;
}