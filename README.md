# Eternal Security

This project utilizes Express.js and Google's Generative AI to create an image analysis agent. The agent is capable of recognizing differences between two images and describing them. If a person is detected in the images, it provides a description; otherwise, it returns "no intruder."

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd eternal-security
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add your Google Generative AI API key:

    ```plaintext
    API_KEY=your-api-key
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. Access the application through a web browser or send POST requests to the `/api/submit-images` endpoint with two images to analyze.

## API Endpoints

- **POST /api/submit-images**: Uploads two images and analyzes the differences between them.

    - Request Parameters:
        - image1: The first image file.
        - image2: The second image file.

    - Response:
        - Status: 200 OK
        - Body: JSON object with a message describing the differences between the images.

## Configuration

- **MODEL_NAME**: The name of the generative model to use for text generation.
- **API_KEY**: Your Google Generative AI API key. Make sure to set this as an environment variable.

## Folder Structure

- **uploads/**: Stores uploaded images.
- **public/**: Contains static files served by Express.js.
- **README.md**: Documentation for the project.
- **app.js**: Main application file.
- **package.json**: Contains project metadata and dependencies.

## Dependencies

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **@google/generative-ai**: Google's Generative AI package for text generation and conversation modeling.

