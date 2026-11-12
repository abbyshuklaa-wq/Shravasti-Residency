# Shravasti Residency 3D + AI Review Portal

## Setup
1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env`.
3. Add your own OpenAI API key to `OPENAI_API_KEY` in `.env`.
4. Run `npm install`, then `npm start`.
5. Open http://localhost:3000.

## Included
- Procedural Three.js 3D female virtual host with gold/cyan lighting, idle motion, particles and rating-reactive expression.
- Guest feedback selections, Hindi/English review generation, editable draft, copy and Google Maps link.
- Express backend using OpenAI Responses API, request validation, rate limiting and Helmet security headers.

## Important
- API integration code is included, but AI requests will work only after you add your own API key to the server `.env` file and run/deploy the Node server.
- Never put your API key in browser HTML or share it in chat. Keep `.env` private.
- The 3D woman is a procedural stylized model made from Three.js meshes, not a photorealistic scanned avatar or licensed GLB character. A higher-detail licensed GLB can be added later.
- Three.js is loaded from jsDelivr CDN; the browser needs internet access.
- Reviews are not posted automatically. The guest must check, edit and submit their own honest review.
- Deploy the Node app on HTTPS hosting and create a QR code for the live URL.
