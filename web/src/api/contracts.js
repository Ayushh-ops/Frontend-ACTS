// API Base URL from Environment Variable
// Ensure VITE_API_BASE_URL is added to your .env file
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Data Contracts (API Stubs)
 * 
 * 1. Submit New Issue
 * Endpoint: POST /api/issues
 * Headers: Content-Type: multipart/form-data
 * Payload (FormData): 
 *  - image: File (Blob)
 *  - description: string
 *  - latitude: number
 *  - longitude: number
 * Response (201 Created):
 * {
 *   "id": 4093,
 *   "status": "success",
 *   "message": "Issue submitted to AI pipeline"
 * }
 * 
 * 2. Get Admin Tickets
 * Endpoint: GET /api/tickets
 * Query: ?status=unassigned (optional filter)
 * Response (200 OK):
 * [
 *   {
 *     "id": 4092,
 *     "severity": 9,
 *     "title": "Deep Road Pothole",
 *     "location": "Campus Gate 2",
 *     "status": "Needs Action"
 *   }, ...
 * ]
 * 
 * 3. Get Map Issues
 * Endpoint: GET /api/map/issues
 * Query: ?radius=5km&lat=28.62&lng=77.44
 * Response (200 OK):
 * [
 *   {
 *     "id": 4092,
 *     "lat": 28.6291,
 *     "lng": 77.4468,
 *     "severity": 9,
 *     "title": "Deep Road Pothole",
 *     "location": "Campus Gate 2",
 *     "distance": "120m away"
 *   }, ...
 * ]
 * 
 * 4. Get Issue Detail
 * Endpoint: GET /api/issues/:id
 * Response (200 OK):
 * {
 *   "id": 4092,
 *   "title": "Deep Road Pothole",
 *   "category": "Civil / Roads",
 *   "severity": 9,
 *   "yolo_imageUrl": "https://...",
 *   "yolo_detections": [
 *      { "label": "pothole", "confidence": 0.92, "box": { "top": "40%", "left": "30%", "w": "120px", "h": "60px" } }
 *   ],
 *   "gemini_insight": "Detected a severe hazard...",
 *   "location_text": "Campus Gate 2, Main Drive",
 *   "status": "Needs Action"
 * }
 * 
 * 5. Update Issue Status
 * Endpoint: PUT /api/issues/:id/status
 * Payload (JSON):
 * {
 *   "status": "Crew Dispatched"
 * }
 * Response (200 OK):
 * {
 *   "id": 4092,
 *   "status": "Crew Dispatched"
 * }
 */
