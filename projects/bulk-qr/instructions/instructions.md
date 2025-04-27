## Bulk QR Code Generator

### Description
A client-side tool for generating multiple QR codes at once. Users can input text (one entry per line) in a text area, and the tool will generate QR codes for each line. The QR codes can be customized and downloaded individually or in bulk.

### Core Features
- Text area input with line-by-line processing
- Real-time QR code preview
- Individual and bulk download options
- Maximum 20 QR codes at once
- Client-side only (no server processing)

### Customization Options
- QR code size
- Error correction level
- Colors (foreground/background)
- Download format (PNG)

### User Interface
- Clean, modern interface with dark mode support
- Responsive design that works well on all screen sizes
- Clear feedback on limits and processing status
- Easy-to-use customization controls

### Technical Requirements
- React for UI
- qrcode.js for QR code generation
- File handling for bulk downloads 

## Findings
- Always ask before including new technology/dependencies
- Using pnpm as package manager 